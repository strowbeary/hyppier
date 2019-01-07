import {types} from "mobx-state-tree";
import LocationStore from "./LocationStore/LocationStore";
import ObjectStore from "./ObjectStore/ObjectStore";
import AchievementStore from "./AchievementStore/AchievementStore";

export default types
    .model("ObjectKindStore", {
        name: types.string,
        objects: types.array(ObjectStore),
        objectTimeout: types.number,
        replacementCounter: types.number,
        location: types.maybe(LocationStore),
        activeObject: types.array(types.number),
        achievementPromotions: AchievementStore,
        achievementSpecialTint: AchievementStore
    })
    .actions(self => ({
        setLocation(location) {
            self.location = location;
        }
    }));
