import * as BABYLON from "babylonjs";
import {showAxis} from "./Axis";
import LocationStore from "../../../../stores/CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/LocationStore";
import CatalogStore from "../../../../stores/CatalogStore/CatalogStore";

function locationManager(mesh, scene, meshCallback) {
    const locationOption = mesh.name.substring(0, mesh.name.length - 1).split("(")[1].split(",");
    const objectKindPath = CatalogStore.findobjectKindsPath(locationOption[0]);
    const objectKind = CatalogStore.objectTypes[objectKindPath[0]].objectKinds[objectKindPath[1]];
    objectKind.setLocation(
        LocationStore.create({
            filledAtStartup: locationOption[1] === "true",
            previewObject: [0, 0],
            coordinates: JSON.parse(JSON.stringify(mesh.position))
        })
    );
    if (locationOption[1] === "true") {
        BABYLON.SceneLoader.LoadAssetContainer(
            "/models/",
            objectKind.objects[0].modelUrl,
            null,
            container => {
                try {
                    container.meshes.forEach(loadedMesh => {
                        if (loadedMesh.name.includes("Location")) {
                            loadedMesh.scaling = new BABYLON.Vector3(0,0,0);
                            locationManager(loadedMesh, scene, meshCallback);
                            showAxis(scene, {
                                position: loadedMesh.position,
                                label: loadedMesh.name,
                                size: 0.5
                            });
                        } else {
                            loadedMesh.convertToFlatShadedMesh();
                            const locationPosition = new BABYLON.Vector3(
                                objectKind.location.coordinates.x,
                                objectKind.location.coordinates.y,
                                objectKind.location.coordinates.z
                            );
                            loadedMesh.position = locationPosition;
                            loadedMesh.getChildren().forEach(mesh => {
                                mesh.position.addInPlace(locationPosition);
                            });
                            meshCallback(loadedMesh);
                        }
                    });
                } catch (e) {
                    console.log(e, locationOption);
                }

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
                loadedMesh.scaling = new BABYLON.Vector3(0,0,0);
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
