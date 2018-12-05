import {types} from "mobx-state-tree";
import ObjectStore from "./TintStore/TintStore";

export default types.model({
    name: types.string,
    ad: types.string,
    modelFilename: types.string,
    tints: types.array(ObjectStore),
})
