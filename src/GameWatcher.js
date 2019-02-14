import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {onPatch} from "mobx-state-tree";
import CameraStore from "./stores/CameraStore/CameraStore";
import {CameraManager} from "./components/app/GameCanvas/CameraManager";

export class GameWatcher {

    static updateWatchers = [];

    static watch() {
        return Promise.resolve(
            CatalogStore.objectKinds.forEach(objectKind => {
                let oldPreviewObjectId = null;
                onPatch(objectKind, patch => {
                    try {
                        if (patch.path.includes("activeObject") && patch.op === "replace") {
                            if (objectKind.oldActiveObject !== null) {
                                const oldlambdaMesh = objectKind.objects[objectKind.oldActiveObject].getModel();
                                if (patch.value !== null) {
                                    const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                    GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, oldlambdaMesh, objectKind.type));
                                } else {
                                    GameWatcher.updateWatchers.forEach(watcher => watcher(null, oldlambdaMesh, null));
                                }
                            } else {
                                const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, null, objectKind.type));
                            }
                        } else if (objectKind.activeObject !== null && patch.path.includes("model")) {
                            if(objectKind.objects[objectKind.activeObject].model >= 0) {
                                /**
                                 * New object
                                 */
                                const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                lambdaMesh.mesh.position = objectKind.location.toVector3();
                                GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, null));
                            }
                        }
                        else if (patch.path.includes("previewObjectId")) {
                            if (patch.value !== null) {
                                oldPreviewObjectId = objectKind.location.previewObjectId;
                                let oldLambdaMesh = null;
                                if (objectKind.activeObject !== null) {
                                    oldLambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                }
                                const lambdaMesh = objectKind.objects[objectKind.location.previewObjectId].getModel();
                                lambdaMesh.mesh.position = objectKind.location.toVector3();
                                GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, oldLambdaMesh, null));
                                CameraStore.setTarget(
                                    lambdaMesh.mesh.name,
                                    CameraManager.CATALOG_OFFSET
                                );

                            } else {
                                const lambdaMesh = objectKind.objects[oldPreviewObjectId].getModel();
                                let activeLambdaMesh = null;
                                if (objectKind.activeObject !== null) {
                                    activeLambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                }
                                GameWatcher.updateWatchers.forEach(watcher => watcher(activeLambdaMesh, lambdaMesh, null));
                                oldPreviewObjectId = null;
                                CameraStore.setTarget();
                            }
                        }

                    } catch (e) {
                        console.error(e);
                    }
                });
            })
        )
    }

    static onUpdate(watcher) {
        if (typeof watcher === "function") {
            GameWatcher.updateWatchers.push(watcher);
        } else {
            throw new Error("Type Error : watcher parameter must be a function");
        }
        return GameWatcher;
    }

}

