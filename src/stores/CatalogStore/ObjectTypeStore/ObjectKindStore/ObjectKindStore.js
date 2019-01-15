import {types} from "mobx-state-tree";
import LocationStore from "./LocationStore/LocationStore";
import ObjectStore from "./ObjectStore/ObjectStore";
import AchievementStore from "./AchievementStore/AchievementStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../CatalogStore";
import {LambdaMesh} from "../../../../components/app/GameCanvas/LambdaMesh";

export default types
    .model("ObjectKindStore", {
        name: types.string,
        objects: types.array(ObjectStore),
        objectTimeout: types.number,
        replacementCounter: types.number,
        location: types.maybe(LocationStore),
        activeObject: types.maybeNull(types.array(types.number)),
        achievementPromotions: AchievementStore,
        achievementSpecialTint: AchievementStore
    })
    .actions(self => ({
        afterCreate() {
            if (self.activeObject !== null) {
                BABYLON.SceneLoader.LoadAssetContainerAsync(
                    "/models/",
                    self.objects[self.activeObject[0]].modelUrl
                ).then((container) => {
                    container.meshes.forEach(loadedMesh => {
                        if (loadedMesh.name.includes("Location")) {
                            const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
                            CatalogStore.getObjectKind(locationOption[0]).setLocation(
                                LocationStore.create({
                                    previewObject: null,
                                    coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                                })
                            );
                        } else {
                            self.objects[self.activeObject[0]].setModel(new LambdaMesh(loadedMesh, self.toJSON()));
                        }
                    });
                });
            }
        },
        setLocation(location) {
            self.location = location;
        },
        setActiveObject(object, tint) {
            const newActiveObject = [
                object,
                tint
            ];
            if(self.activeObject !== newActiveObject) {
                self.activeObject = newActiveObject;
                BABYLON.SceneLoader.LoadAssetContainerAsync(
                    "/models/",
                    self.objects[self.activeObject[0]].modelUrl
                ).then((container) => {
                    container.meshes.forEach(loadedMesh => {
                        if (loadedMesh.name.includes("Location")) {
                            const locationOption = loadedMesh.name.substring(0, loadedMesh.name.length - 1).split("(")[1].split(",");
                            CatalogStore.getObjectKind(locationOption[0]).setLocation(
                                LocationStore.create({
                                    previewObject: null,
                                    coordinates: JSON.parse(JSON.stringify(loadedMesh.position))
                                })
                            );
                        } else {
                            if(self.location) {
                                loadedMesh.position = self.location.toVector3();
                            }
                            self.objects[self.activeObject[0]].setModel(new LambdaMesh(loadedMesh, self));
                        }
                    });
                });
            }
        },
        preloadNextObject() {
            const objectIndex = (self.activeObject === null) ? 0 : (self.activeObject[0] + 1);
            if (objectIndex < self.objects.length) {
                BABYLON.SceneLoader.LoadAssetContainerAsync(
                    "/models/",
                    self.objects[objectIndex].modelUrl
                ).then((container) => {
                    container.meshes.forEach(loadedMesh => {
                        if (!loadedMesh.name.includes("Location")) {
                                if (self.location) {
                                    loadedMesh.position = self.location.toVector3();
                                }
                                self.objects[objectIndex].setModel(new LambdaMesh(loadedMesh, self));
                        }
                    });
                });
            }
        }
    }));
