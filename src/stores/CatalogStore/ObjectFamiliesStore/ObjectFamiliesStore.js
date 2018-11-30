import {types} from "mobx-state-tree";
import GenerationStore from "./GenerationStore/GenerationStore";

export default types.model("ObjectFamilyStore", {
    name: types.string,
    generations: types.array(GenerationStore),
    catalogGeneration: types.number,
    generationTimeout: types.number
});
