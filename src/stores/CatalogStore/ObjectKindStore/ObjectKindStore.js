import {types} from "mobx-state-tree";
import LocationStore from "./LocationStore/LocationStore";
import ObjectStore from "./ObjectStore/ObjectStore";
import * as BABYLON from "babylonjs";
import {LambdaMesh} from "../../../components/app/GameCanvas/LambdaMesh";
import CoordsStore from "./LocationStore/CoordsStore/CoordsStore";
import {showAxis} from "../../../components/app/utils/Axis";

function loadObject(objectKind) {
    BABYLON.SceneLoader.LoadAssetContainerAsync(
        "./models/",
        objectKind.objects[objectKind.activeObject].modelUrl
    ).then((container) => {
        container.meshes.forEach(loadedMesh => {
            if (!loadedMesh.name.includes("Location")) {
                objectKind.objects[objectKind.activeObject].setModel(new LambdaMesh(loadedMesh, objectKind.objectTimeout, objectKind.name));
            }
        });
    });
}
function preloadNextObject(objectKind) {
    const objectIndex = objectKind.replacementCounter + 1;
    if (objectIndex < objectKind.objects.length) {
        BABYLON.SceneLoader.LoadAssetContainerAsync(
            "./models/",
            objectKind.objects[objectIndex].modelUrl
        ).then((container) => {
            container.meshes.forEach(loadedMesh => {
                if (!loadedMesh.name.includes("Location")) {
                    loadedMesh.position = objectKind.location.toVector3();


                    objectKind.objects[objectIndex].setModel(new LambdaMesh(loadedMesh, objectKind.objectTimeout, objectKind.name));
                }
            });
        }).catch(e => console.log(e));
    }
}

export default types
    .model("ObjectKindStore", {
        name: types.string,
        objects: types.array(ObjectStore),
        objectTimeout: types.number,
        replacementCounter: types.number,
        location: types.maybe(LocationStore),
        activeObject: types.maybeNull(types.number),
        oldActiveObject: types.maybeNull(types.number),
        type: types.string
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
                self.replacementCounter = 0;
            } else {
                self.replacementCounter = -1;
            }
            preloadNextObject(self);
        },
        updateReplacementCounter() {
            self.replacementCounter++;
            preloadNextObject(self);
        },
        setActiveObject(objectId) {
            if (self.activeObject !== objectId) {
                self.oldActiveObject = self.activeObject;
                self.activeObject = objectId;
            }
        }
    }));
