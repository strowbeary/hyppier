import {types} from "mobx-state-tree";
import PositionStore from "./PositionStore/PositionStore";

export default types.model("PopupStore", {
    activePopup: types.maybeNull(types.array(types.number)),
    firstPosition: PositionStore
})
    .actions(self => ({
        addPopup(objectIndex) {
            let index = self.activePopup.indexOf(objectIndex);
            if (index === -1) {
                self.activePopup.push(objectIndex);
            }
        },
        removePopup(objectIndex) {
            let index = self.activePopup.indexOf(objectIndex);
            if (index !== -1) {
                self.activePopup.splice(index, 1);
            }
        }
    }))
    .views(self => ({
        isActivePopup(objectIndex) {
            return self.activePopup.indexOf(objectIndex) > -1;
        }
    }))
    .create({
        activePopup: [],
        firstPosition: PositionStore.create({
            x: 0,
            y: 0
        })
    })
