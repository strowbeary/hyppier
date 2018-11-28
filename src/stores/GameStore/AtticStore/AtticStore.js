import {types} from "mobx-state-tree";

export default types.model("AtticStore", {
    parcels: types.array(types.refinement(types.array(types.number), value => value.length === 2)),
    parcelsCoordinates: types.array(types.refinement(types.array(types.number), value => value.length === 3)),
    parcelsNumberLimit: 10
});
