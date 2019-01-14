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
    static async init(scene) {
        await GameStarter.loadRoom(scene);
    }
}
