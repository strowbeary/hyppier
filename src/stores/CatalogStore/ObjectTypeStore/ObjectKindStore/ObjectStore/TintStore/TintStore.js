import {types} from "mobx-state-tree";

export default types.model("TintStore", {
    name: types.string,
    thumbnailUrl: types.string,
    materials: types.array(types.number),
    special: false,
    color: types.string
});
