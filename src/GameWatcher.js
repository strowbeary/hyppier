import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {onSnapshot} from "mobx-state-tree";
import LocationStore from "./stores/CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/LocationStore";

export class GameWatcher {
    static updateWatchers = [];

    static watch() {
        CatalogStore.objectTypes.forEach(objectType => {
            objectType.objectKinds.forEach(objectKind => {
                let oldPreviewObject = null;
                onSnapshot(objectKind, newObjectKind => {
                    if (newObjectKind.activeObject !== null) {
                        if (typeof newObjectKind.objects[newObjectKind.activeObject[0]].model !== "undefined") {
                            const mesh = objectKind.objects[objectKind.activeObject[0]].getModel();
                            let oldMesh = null;
                            const oldObject = objectKind.objects[objectKind.activeObject[0] - 1];
                            if (oldObject) {
                                oldMesh = oldObject.getModel();
                            }

                            if (newObjectKind.location) {
                                const mesh = objectKind.objects[objectKind.activeObject[0]].getModel().mesh;
                                const locationPosition = objectKind.location.toVector3();
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
                            }

                            GameWatcher.updateWatchers.forEach(watcher => watcher(mesh, oldMesh));
                        }

                    }
                    if (newObjectKind.location.previewObject !== null && oldPreviewObject === null) {
                        oldPreviewObject = newObjectKind.location.previewObject;
                        GameWatcher.updateWatchers.forEach(watcher => {
                            watcher(objectKind.objects[newObjectKind.location.previewObject[0]].getModel(), null)
                        });
                    } else if(oldPreviewObject !== null && newObjectKind.location.previewObject === null) {
                        GameWatcher.updateWatchers.forEach(watcher => {
                            watcher(null, objectKind.objects[oldPreviewObject[0]].getModel())
                        });
                        oldPreviewObject = newObjectKind.location.previewObject;
                    }
                })
            });
        });
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

