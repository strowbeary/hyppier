import * as BABYLON from "babylonjs";
import {showAxis} from "./components/app/3dScene/utils/Axis";
import CatalogStore from "./stores/CatalogStore/CatalogStore";
import LocationStore from "./stores/CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/LocationStore";
import {onSnapshot} from "mobx-state-tree";

let meshShelf = [];

async function loadRoom(scene) {
    const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
        "/models/",
        "room.babylon"
    );
    container.meshes.forEach(loadedMesh => {
        if (loadedMesh.name.includes("Location")) {
            const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
            /* *
            * Set location to corresponding object kind
            * */
            CatalogStore.getObjectKind(locationOption[0]).setLocation(
                LocationStore.create({
                    filledAtStartup: locationOption[1] === "true",
                    previewObject: [0, 0],
                    coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                })
            );
            showAxis(scene, {
                position: loadedMesh.position,
                label: loadedMesh.name,
                size: 0.5
            });
            loadedMesh.scaling = new BABYLON.Vector3(0, 0, 0);
        } else {
            loadedMesh.convertToFlatShadedMesh();
            loadedMesh.freezeWorldMatrix();
            loadedMesh.material.freeze();
        }
        scene.addMesh(loadedMesh);
    });
}

async function loadObjects(scene) {
    const firstBatch = await Promise.all(
        CatalogStore.objectTypes.map(objectType => {
                return objectType.objectKinds
                    .filter(objectKind => objectKind.activeObject !== null)
                    .map(objectKind => {
                        return objectKind.objects.map(object => {
                            return new Promise(resolve => {
                                BABYLON.SceneLoader.LoadAssetContainerAsync(
                                    "/models/",
                                    object.modelUrl
                                ).then(container => {
                                    resolve({
                                        container,
                                        object
                                    })
                                })
                            });
                        });
                    });
            }
        ).flat()
    );
    return Promise.all(firstBatch.flat());
}

export async function initGame(scene, updateDisplayedMesh) {
    await loadRoom(scene);
    let containers = await loadObjects(scene);
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
                            filledAtStartup: locationOption[1] === "true",
                            previewObject: [0, 0],
                            coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                        })
                    );
                    loadedMesh.scaling = new BABYLON.Vector3(0, 0, 0);
                } else {
                    container.object.setModel(meshShelf.length);
                    loadedMesh.convertToFlatShadedMesh();
                    meshShelf.push(loadedMesh);
                    console.log(loadedMesh.name, loadedMesh.scaling);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
    let displayedMesh = [];
    CatalogStore.objectTypes.forEach(objectType => {
        objectType.objectKinds.forEach(objectKind => {
            if (objectKind.activeObject !== null) {
                const mesh = meshShelf[objectKind.objects[objectKind.activeObject[0]].model];
                if (typeof mesh !== "undefined") {
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
                                filledAtStartup: locationOption[1] === "true",
                                previewObject: [0, 0],
                                coordinates: JSON.parse(JSON.stringify(mesh.position))
                            })
                        );
                    });
                    displayedMesh.push(mesh);
                    updateDisplayedMesh(displayedMesh);
                }
            }
        })
    });
    CatalogStore.objectTypes.forEach(objectType => {
        objectType.objectKinds.forEach(objectKind => {
            let oldObjectKind = objectKind.toJSON();
            onSnapshot(objectKind, newObjectKind => {
                    if(oldObjectKind.activeObject === null || oldObjectKind.activeObject[0] < newObjectKind.activeObject[0]) {
                        console.log("pam");
                        oldObjectKind = newObjectKind;
                        BABYLON.SceneLoader.LoadAssetContainerAsync(
                            "/models/",
                            newObjectKind.objects[newObjectKind.activeObject[0]].modelUrl
                        ).then((container) => {
                            return container.meshes.forEach(loadedMesh => {
                                if (loadedMesh.name.includes("Location")) {
                                    const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
                                    console.log(locationOption);
                                } else {
                                    objectKind.objects[newObjectKind.activeObject[0]].setModel(meshShelf.length);
                                    loadedMesh.position = new BABYLON.Vector3(
                                        newObjectKind.location.coordinates.x,
                                        newObjectKind.location.coordinates.y,
                                        newObjectKind.location.coordinates.z
                                    );
                                    loadedMesh.convertToFlatShadedMesh();
                                    loadedMesh.freezeWorldMatrix();
                                    loadedMesh.material.freeze();
                                    meshShelf.push(loadedMesh);
                                }
                            })
                        }).then(() => {
                            let meshToDisplay = CatalogStore.objectTypes.map(objectType => {
                                return objectType.objectKinds
                                    .filter(objectKind => objectKind.activeObject !== null)
                                    .map(objectKind => meshShelf[objectKind.objects[objectKind.activeObject[0]].model])
                            }).flat();
                            updateDisplayedMesh(meshToDisplay);
                            return;
                        })
                    }
            })
        })
    });
    return;
}
