import {types} from "mobx-state-tree";
import ObjectKindStore from "./ObjectKindStore/ObjectKindStore";
import ClueEventStore from "./ClueEventStore/ClueEventStore";

export default types.model("ObjectTypeStore", {
    name: types.string,
    clueEvent: ClueEventStore,
    replacementCounter: types.number,
    objectKinds: types.array(ObjectKindStore)
});
