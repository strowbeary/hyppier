import * as BABYLON from "babylonjs";
import CatalogStore from "./stores/CatalogStore/CatalogStore";

export class GameStarter {
    static async loadRoom(scene) {
        const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
            "./models/",
            "room.babylon"
        );
        return container.meshes.forEach(loadedMesh => {
            try {
                if (loadedMesh.name.includes("Location")) {
                    const locationOption = loadedMesh.name.split(".")[0].split(")")[0].split("(")[1];
                    /* *
                     * Set location to corresponding object kind
                     * */
                    const objectKind = CatalogStore.getObjectKind(locationOption);
                    if(objectKind) {
                        objectKind.location.setPosition(loadedMesh.position);
                    }
                } else if(!loadedMesh.name.includes("Ladder-Position")) {
                    loadedMesh.receiveShadows = true;
                    console.log(loadedMesh.name);
                    loadedMesh.convertToFlatShadedMesh();
                    loadedMesh.convertToUnIndexedMesh();
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
        return await GameStarter.loadRoom(scene);
    }
}
