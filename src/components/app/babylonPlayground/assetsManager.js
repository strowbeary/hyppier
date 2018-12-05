import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import LocationStore from "../../../stores/CatalogStore/ObjectFamiliesStore/LocationStore/LocationStore";

const findFamilyIndex = (familyName) => CatalogStore.objectFamilies.toJSON().map(o => o.toJSON()).findIndex(family => family.name === familyName);

function locationManager(mesh, scene) {
    const locationOption = mesh.name.substring(0, mesh.name.length - 1).split("(")[1].split(",");
    const family = CatalogStore
        .objectFamilies[findFamilyIndex(locationOption[0])];
    family.setLocation(
        LocationStore.create({
            type: locationOption[0],
            currentObject: [findFamilyIndex(locationOption[0]), 0, 0],
            coordinates: JSON.parse(JSON.stringify(mesh.position))
        })
    );
    console.log(CatalogStore.toJSON());
    if (locationOption[1] === "true") {
        BABYLON.SceneLoader.LoadAssetContainer(
            "/models/",
            family.generations[0].modelFilename,
            scene,
            container => {
                container.meshes.forEach(loadedMesh => {
                    if (loadedMesh.name.includes("Location")) {
                        console.log(loadedMesh.parent.name);
                        locationManager(loadedMesh, scene)
                    } else {
                        loadedMesh.position = family.location.coordinates;
                    }
                });
                container.addAllToScene();
            }
        )
    }
}

export function assetsManager(scene) {
    const assetsManager = new BABYLON.AssetsManager(scene);
    //Scene loading loop
    assetsManager.addMeshTask("room task", null, "/models/", "room.babylon");
    assetsManager.onProgress = (remainingCount, totalCount, task) => {
        task.loadedMeshes.forEach(loadedMesh => {
            if (loadedMesh.name.includes("Location")) {
                locationManager(loadedMesh, scene)
            }
        });
    };
    assetsManager.load();
}
