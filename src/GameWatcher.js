import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {onSnapshot} from "mobx-state-tree";
import * as BABYLON from "babylonjs";
import LocationStore from "./stores/CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/LocationStore";

export class GameWatcher {
    static updateWatchers = [];

    static async loadNewObjects(newObjectKind, objectKind) {
        const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
            "/models/",
            newObjectKind.objects[newObjectKind.activeObject[0]].modelUrl
        );
        return container.meshes.forEach(loadedMesh => {
            if (loadedMesh.name.includes("Location")) {
                const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
            } else {
                loadedMesh.position = new BABYLON.Vector3(
                    newObjectKind.location.coordinates.x,
                    newObjectKind.location.coordinates.y,
                    newObjectKind.location.coordinates.z
                );
                loadedMesh.convertToFlatShadedMesh();
                loadedMesh.freezeWorldMatrix();
                loadedMesh.material.freeze();
                objectKind.objects[newObjectKind.activeObject[0]].setModel(loadedMesh);
            }
        })
    }

    static changeHandler(newObjectKind, oldObjectKind, objectKind) {
        return this.loadNewObjects(newObjectKind, objectKind)
            .then(() => {
                let meshToDisplay = CatalogStore.objectTypes.map(objectType => {
                    return objectType.objectKinds
                        .filter(objectKind => objectKind.activeObject !== null)
                        .map(objectKind => {
                            const mesh = objectKind.objects[objectKind.activeObject[0]].getModel();
                            const locationPosition = new BABYLON.Vector3(
                                objectKind.location.coordinates.x,
                                objectKind.location.coordinates.y,
                                objectKind.location.coordinates.z
                            );
                            mesh.position = locationPosition;
                            mesh.getChildren().forEach(mesh => {
                                mesh.position.addInPlace(locationPosition);
                                const locationOption = mesh.name.substring(0, mesh.name.length - 1).split("(")[1].split(",");
                                /* *
                                * Set location to corresponding object kind
                                * */
                                CatalogStore.getObjectKind(locationOption[0]).setLocation(
                                    LocationStore.create({
                                        previewObject: null,
                                        coordinates: JSON.parse(JSON.stringify(mesh.position))
                                    })
                                );
                            });
                            return mesh;
                        })
                }).flat();

                return meshToDisplay;
            })
    }

    static async watch() {
        CatalogStore.objectTypes.forEach(objectType => {
            objectType.objectKinds.forEach(objectKind => {
                let oldObjectKind = objectKind.toJSON();
                GameWatcher.changeHandler(oldObjectKind, oldObjectKind, objectKind)
                    .then(meshToDisplay => {
                        GameWatcher.updateWatchers.forEach(watcher => watcher(meshToDisplay));
                    });
                onSnapshot(objectKind, newObjectKind => {
                    if(oldObjectKind.activeObject === null || oldObjectKind.activeObject[0] < newObjectKind.activeObject[0]) {
                        oldObjectKind = newObjectKind;
                        GameWatcher
                            .changeHandler(newObjectKind, oldObjectKind, objectKind)
                            .then(meshToDisplay => {
                                GameWatcher.updateWatchers.forEach(watcher => watcher(meshToDisplay));
                            })
                    }
                })
            })
        });
        return GameWatcher;
    }

    static onUpdate(watcher) {
        if (typeof watcher === "function") {
            GameWatcher.updateWatchers.push(watcher);
        } else {
            throw new Error("Type Error : watcher parameter must be a function");
        }
        return GameWatcher;
    }

}

