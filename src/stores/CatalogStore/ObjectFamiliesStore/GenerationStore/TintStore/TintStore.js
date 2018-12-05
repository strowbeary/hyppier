import {types} from "mobx-state-tree";

export default types.model("TintStore", {
    name: types.string,
    thumbnailUrl: types.string,
    parcelSize: types.number
});
