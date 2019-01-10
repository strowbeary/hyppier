import * as BABYLON from "babylonjs";
import CatalogStore from "./stores/CatalogStore/CatalogStore";
import LocationStore from "./stores/CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/LocationStore";

export class GameStarter {
    static async loadRoom(scene) {
        const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
            "/models/",
            "room.babylon"
        );
        return container.meshes.forEach(loadedMesh => {
            if (loadedMesh.name.includes("Location")) {
                const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
                /* *
                * Set location to corresponding object kind
                * */
                CatalogStore.getObjectKind(locationOption[0]).setLocation(
                    LocationStore.create({
                        previewObject: null,
                        coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                    })
                );
                loadedMesh.scaling = new BABYLON.Vector3(0, 0, 0);
            } else {
                loadedMesh.receiveShadows = true;
                loadedMesh.convertToFlatShadedMesh();
                loadedMesh.freezeWorldMatrix();
                //loadedMesh.material.freeze();
                scene.addMesh(loadedMesh);
            }
        });
    }

    static async loadObjects() {
        return Promise.all(CatalogStore.objectTypes.map(objectType => {
            return objectType.objectKinds
                .filter(objectKind => objectKind.activeObject !== null)
                .map(objectKind =>
                    objectKind.objects.map(object =>
                        new Promise(resolve => {
                            BABYLON.SceneLoader.LoadAssetContainerAsync(
                                "/models/",
                                object.modelUrl
                            ).then((container) => resolve({
                                container,
                                object
                            }));

                        })
                    )
                )
        }).flat().flat());
    }

    static async init(scene) {
        await GameStarter.loadRoom(scene);
        let containers = await GameStarter.loadObjects(scene);
        containers.forEach(container => {
            try {
                container.container.meshes.forEach(loadedMesh => {
                    if (loadedMesh.name.includes("Location")) {
                        const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
                        /* *
                        * Set location to corresponding object kind
                        * */
                        CatalogStore.getObjectKind(locationOption[0]).setLocation(
                            LocationStore.create({
                                previewObject: null,
                                coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                            })
                        );
                        loadedMesh.scaling = new BABYLON.Vector3(0, 0, 0);
                    } else {
                        loadedMesh.convertToFlatShadedMesh();
                        container.object.setModel(loadedMesh);
                    }
                });
            } catch (e) {
                console.error(e);
            }
        });

        return;
    }
}
