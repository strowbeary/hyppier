import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";

export default types.model("LocationStore", {
    type: types.string,
    currentObject: types.refinement(types.array(types.number), value => value.length === 3),
    previewObject: types.maybe(types.refinement(types.array(types.number), value => value.length === 3)),
    coordinates: CoordsStore
})
