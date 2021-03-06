import {types} from "mobx-state-tree";
import ParcelTypeStore from "./ParcelTypeStore/ParcelTypeStore";

export default types.model("AtticStore", {
    parcelsNumberLimit: 20,
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
        isGameLost() {
            return (self.electric.parcelsNumber + self.furniture.parcelsNumber + self.mobility.parcelsNumber) >= self.parcelsNumberLimit;
        }
    })
);
