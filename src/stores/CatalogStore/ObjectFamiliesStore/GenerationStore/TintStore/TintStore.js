import {types} from "mobx-state-tree";

export default types.model("TintStore", {
    thumbnailUrl: types.string,
    parcelSize: types.number
});
