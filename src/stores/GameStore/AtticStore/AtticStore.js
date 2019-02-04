import {types} from "mobx-state-tree";
import ParcelTypeStore from "./ParcelTypeStore/ParcelTypeStore"

export default types.model("AtticStore", {
    parcelsNumberLimit: 2,
    electric: ParcelTypeStore,
    furniture: ParcelTypeStore,
    atticVisible: false
}).actions(self =>
    ({
        incrementParcelsNumberOf(objectKindType) {
            self[objectKindType].incrementParcelsNumber();
        },
        setAtticVisibility(value) {
            self.atticVisible = value;
        }
    })
).views(self =>
    ({
        shouldLaunchClueEvent(objectKindType) {
            if(!self[objectKindType].clueEventLaunched && self[objectKindType].parcelsNumber >= 1) { //1 is the limit for testing
                self[objectKindType].updateClueEventLaunched();
                return true;
            } else {
                return false;
            }
        },
        isGameOver() {
            return self.electric.parcelsNumber + self.furniture.parcelsNumber >= self.parcelsNumberLimit;
        }
    })
);
