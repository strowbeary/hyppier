import {types} from "mobx-state-tree";
import ObjectStore from "./ObjectStore/ObjectStore";

export default types.model({
    ad: types.string,
    objects: types.array(ObjectStore)
})
