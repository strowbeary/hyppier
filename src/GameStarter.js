import * as BABYLON from "babylonjs";
import CatalogStore from "./stores/CatalogStore/CatalogStore";

export class GameStarter {
    static async loadRoom(scene) {
        const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
            "./models/",
            "room.babylon"
        );
        return container.meshes.forEach(loadedMesh => {
            try{
                if (loadedMesh.name.includes("Location")) {
                    const locationOption = loadedMesh.name.split(".")[0].split(")")[0].split("(")[1];
                   /* *
                    * Set location to corresponding object kind
                    * */
                    CatalogStore.getObjectKind(locationOption).location.setPosition(loadedMesh.position);
                    loadedMesh.scaling = new BABYLON.Vector3(0, 0, 0);
                } else {
                    loadedMesh.receiveShadows = true;
                    loadedMesh.convertToFlatShadedMesh();
                    loadedMesh.freezeWorldMatrix();
                    //loadedMesh.material.freeze();
                    scene.addMesh(loadedMesh);
                }
            } catch (e) {
                console.error(e);
            }

        });
    }
    static async init(scene) {
        await GameStarter.loadRoom(scene);
    }
}
