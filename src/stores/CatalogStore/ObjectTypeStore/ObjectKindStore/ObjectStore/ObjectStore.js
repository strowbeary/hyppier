import {types} from "mobx-state-tree";
import TintStore from "./TintStore/TintStore";
import InfoStore from "./InfoStore/InfoStore";

export default types.model("ObjectStore", {
    name: types.string,
    adUrl: types.string,
    closeMessage: types.string,
    catalogMessage: types.string,
    parcelSize: types.number,
    modelUrl: types.string,
    model: types.maybe(types.number),
    tints: types.array(TintStore),
    infos: types.array(InfoStore)
})
    .actions(self => ({
        setModel(id) {
            self.model = id;
        }
    }));
