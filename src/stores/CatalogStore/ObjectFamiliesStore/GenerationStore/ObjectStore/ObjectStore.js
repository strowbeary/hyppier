import {types} from "mobx-state-tree";

export default types.model({
    name: types.string,
    model3dUrl: types.string,
    thumbnailUrl: types.string,
    parcelSize: types.number
})
