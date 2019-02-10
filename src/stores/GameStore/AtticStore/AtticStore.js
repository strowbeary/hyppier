import {types} from "mobx-state-tree";
import ParcelTypeStore from "./ParcelTypeStore/ParcelTypeStore";

export default types.model("AtticStore", {
    parcelsNumberLimit: 1000,
    electric: ParcelTypeStore,
    furniture: ParcelTypeStore,
    mobility: ParcelTypeStore,
    atticVisible: false
}).actions(self =>
    ({
        incrementParcelsNumberOf(objectKindType) {
            if(self[objectKindType]) {
                self[objectKindType].incrementParcelsNumber();
            }
        },
        setAtticVisibility(value) {
            self.atticVisible = value;
        }
    })
).views(self =>
    ({
        shouldLaunchClueEvent(objectKindType) {
            if(self[objectKindType]) {
                if (!self[objectKindType].clueEventLaunched && self[objectKindType].parcelsNumber >= self[objectKindType].parcelsNumberLimit) {
                    self[objectKindType].updateClueEventLaunched();
                    return true;
                } else {
                    return false;
                }
            }
        },
        isGameOver() {
            return self.electric.parcelsNumber >= self.parcelsNumberLimit;
        }
    })
);
