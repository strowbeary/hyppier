import {types} from "mobx-state-tree";

export default types.model("ParcelTypeStore", {
    parcelsNumber: 0,
    parcelsNumberLimit: 5,
    clueEventLaunched: false
}).actions(self =>
    ({
        incrementParcelsNumber() {
            self.parcelsNumber += 1;
        },
        updateClueEventLaunched() {
            self.clueEventLaunched = true;
        }
    })
);
