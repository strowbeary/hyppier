import {types} from "mobx-state-tree";

export default types.model("PlaceStore", {
    objectFamily: types.number,
    currentObject: types.refinement(types.array(types.number), value => value.length === 2),
    coordinates: types.refinement(types.array(types.number), value => value.length === 3),
});
