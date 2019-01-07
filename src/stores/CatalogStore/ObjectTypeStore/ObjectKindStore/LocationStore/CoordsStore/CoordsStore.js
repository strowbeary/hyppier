import {types} from "mobx-state-tree";

export default types.model("CoordsStore", {
    x: types.number,
    y: types.number,
    z: types.number
});
