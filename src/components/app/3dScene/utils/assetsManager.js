import * as BABYLON from "babylonjs";
import CatalogStore from "../../../../stores/CatalogStore/CatalogStore";
import LocationStore from "../../../../stores/CatalogStore/ObjectFamiliesStore/LocationStore/LocationStore";
import {showAxis} from "./Axis";

const findFamilyIndex = (familyName) => CatalogStore.objectFamilies.toJSON().map(o => o.toJSON()).findIndex(family => family.name === familyName);

function locationManager(mesh, scene, meshCallback) {
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
    if (locationOption[1] === "true") {
        BABYLON.SceneLoader.LoadAssetContainer(
            "/models/",
            family.generations[0].modelFilename,
            scene,
            container => {
                container.meshes.forEach(loadedMesh => {
                    if (loadedMesh.name.includes("Location")) {
                        locationManager(loadedMesh, scene, meshCallback);
                        showAxis(scene, {
                            position: loadedMesh.position,
                            label: loadedMesh.name,
                            size: 0.5
                        });
                    } else {
                        loadedMesh.convertToFlatShadedMesh();
                        const locationPosition = new BABYLON.Vector3(
                            family.location.coordinates.x,
                            family.location.coordinates.y,
                            family.location.coordinates.z
                        );
                        loadedMesh.position = locationPosition;
                        loadedMesh.getChildren().forEach(mesh => {
                            mesh.position.addInPlace(locationPosition);
                        });
                        meshCallback(loadedMesh);
                    }
                });
            }
        )
    }
}

export function assetsManager(scene, meshCallback) {
    const assetsManager = new BABYLON.AssetsManager(scene);
    //Scene loading loop
    assetsManager.addMeshTask("room task", null, "/models/", "room.babylon");
    assetsManager.onProgress = (remainingCount, totalCount, task) => {
        task.loadedMeshes.forEach(loadedMesh => {
            if (loadedMesh.name.includes("Location")) {
                locationManager(loadedMesh, scene, meshCallback);
                showAxis(scene, {
                    position: loadedMesh.position,
                    label: loadedMesh.name
                });
            } else {
                loadedMesh.convertToFlatShadedMesh();
                loadedMesh.freezeWorldMatrix();
                loadedMesh.material.freeze();
            }
        });
    };
    assetsManager.load();
}
