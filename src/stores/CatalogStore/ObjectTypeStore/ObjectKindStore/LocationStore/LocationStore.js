import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";

export default types.model("LocationStore", {
    previewObject: types.maybeNull(types.refinement(types.array(types.number), value => value.length === 2)),
    coordinates: CoordsStore
})
