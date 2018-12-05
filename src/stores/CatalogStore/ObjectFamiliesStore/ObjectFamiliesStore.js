import {types} from "mobx-state-tree";
import GenerationStore from "./GenerationStore/GenerationStore";
import LocationStore from "./LocationStore/LocationStore";

export default types
    .model("ObjectFamilyStore", {
        name: types.string,
        type: types.string,
        generations: types.array(GenerationStore),
        generationTimeout: types.number,
        location: types.maybe(LocationStore)
    })
    .actions(self => ({
        setLocation(location) {
            self.location = location;
        }
    }));
