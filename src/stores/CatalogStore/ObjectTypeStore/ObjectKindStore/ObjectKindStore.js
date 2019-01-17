import {types} from "mobx-state-tree";
import LocationStore from "./LocationStore/LocationStore";
import ObjectStore from "./ObjectStore/ObjectStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../CatalogStore";
import {LambdaMesh} from "../../../../components/app/GameCanvas/LambdaMesh";
import CoordsStore from "./LocationStore/CoordsStore/CoordsStore";

function loadObject(objectKind) {
    BABYLON.SceneLoader.LoadAssetContainerAsync(
        "/models/",
        objectKind.objects[objectKind.activeObject].modelUrl
    ).then((container) => {
        container.meshes.forEach(loadedMesh => {
            if (loadedMesh.name.includes("Location")) {
                const locationOption = loadedMesh.name
                    .substring(0, loadedMesh.name.length - 1)
                    .split("(")[1].split(",");
                objectKind.location.setChildren(locationOption[0]);
                CatalogStore.getObjectKind(locationOption[0]).location.setPosition(loadedMesh.position)
            } else {
                objectKind.objects[objectKind.activeObject].setModel(new LambdaMesh(loadedMesh));
            }
        });
    });
}
function preloadNextObject(objectKind) {
    const objectIndex = (objectKind.activeObject === null) ? 0 : (objectKind.activeObject + 1);
    if (objectIndex < objectKind.objects.length) {
        BABYLON.SceneLoader.LoadAssetContainerAsync(
            "/models/",
            objectKind.objects[objectIndex].modelUrl
        ).then((container) => {
            container.meshes.forEach(loadedMesh => {
                if (!loadedMesh.name.includes("Location")) {
                    if (objectKind.location) {
                        loadedMesh.position = objectKind.location.toVector3();
                    }
                    objectKind.objects[objectIndex].setModel(new LambdaMesh(loadedMesh));
                }
            });
        });
    }
}

export default types
    .model("ObjectKindStore", {
        name: types.string,
        objects: types.array(ObjectStore),
        objectTimeout: types.number,
        replacementCounter: types.number,
        location: types.maybe(LocationStore),
        activeObject: types.maybeNull(types.number)
    })
    .actions(self => ({
        afterCreate() {
            self.location = LocationStore.create({
                previewObject: null,
                coordinates: CoordsStore.create({
                    x: 0,
                    y: 0,
                    z: 0
                }),
                children: []
            });
            if (self.activeObject !== null) {
                loadObject(self);
            }
            preloadNextObject(self);
        },
        setActiveObject(objectId) {
            if (self.activeObject !== objectId) {
                self.activeObject = objectId;
                preloadNextObject(self);
            }
        }
    }));
