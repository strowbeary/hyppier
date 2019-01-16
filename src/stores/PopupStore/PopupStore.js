import {types} from "mobx-state-tree";
import PositionStore from "./PositionStore/PositionStore";

export default types.model("PopupStore", {
    activePopup: types.maybeNull(types.array(types.array(types.number))),
    catalogPopup: types.maybeNull(types.array(types.number)),
    firstPosition: PositionStore
})
    .actions(self => ({
        addPopup(objectPath) {
            let index = self.activePopup.indexOf(objectPath);
            if (index === -1) {
                self.activePopup.push(objectPath);
            }
        },
        removePopup(objectPath) {
            let index = self.activePopup.indexOf(objectPath);
            if (index !== -1) {
                self.activePopup.splice(index, 1);
            }
        },
        addCatalogPopup(objectPath) {
            self.catalogPopup = objectPath;
        },
        removeCatalogPopup() {
            self.catalogPopup = null;
        }
    }))
    .views(self => ({
        isActivePopup(objectPath) {
            return self.activePopup.indexOf(objectPath) > -1;
        }
    }))
    .create({
        activePopup: [],
        catalogPopup: null,
        firstPosition: PositionStore.create({
            x: 0,
            y: 0
        })
    })
