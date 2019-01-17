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
                            console.log(objectKind.name, patch);
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

