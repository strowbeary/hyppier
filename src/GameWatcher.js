import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {onPatch} from "mobx-state-tree";

export class GameWatcher {

    static updateWatchers = [];

    static watch() {
        return new Promise(resolve => {
            resolve(
                CatalogStore.objectTypes.forEach(objectType => {
                    objectType.objectKinds.forEach(objectKind => {
                        onPatch(objectKind, patch => {
                            try {
                                console.log(objectKind.name, patch);
                                if (patch.path === "/location/coordinates") {
                                    /**
                                     * Location changes
                                     */
                                    if (objectKind.activeObject !== null) {
                                        const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                        if (lambdaMesh) {
                                            lambdaMesh.mesh.position = objectKind.location.toVector3();
                                            GameWatcher.updateWatchers.forEach(watcher => watcher(null, null));
                                        }
                                    }
                                }

                                if (patch.path.includes("activeObject") && patch.op === "replace" && objectKind.activeObject > 0) {
                                    const oldlambdaMesh = objectKind.objects[objectKind.activeObject - 1].getModel();
                                    const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                    GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, oldlambdaMesh));
                                } else if (objectKind.activeObject !== null && patch.path.includes("model")) {
                                    /**
                                     * New object
                                     */
                                    const lambdaMesh = objectKind.objects[objectKind.activeObject].getModel();
                                    console.log(lambdaMesh.mesh.name);
                                    lambdaMesh.mesh.position = objectKind.location.toVector3();
                                    GameWatcher.updateWatchers.forEach(watcher => watcher(lambdaMesh, null));
                                }


                            } catch (e) {
                                console.error(e);
                            }
                        });
                    });
                })
            )
        })

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

