import {types} from "mobx-state-tree";
import TintStore from "./TintStore/TintStore";
import InfoStore from "./InfoStore/InfoStore";

export default types.model("ObjectStore", {
    name: types.string,
    adUrl: types.string,
    parcelSize: types.number,
    modelUrl: types.string,
    tints: types.array(TintStore),
    infos: types.array(InfoStore)
})
