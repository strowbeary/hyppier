import {types} from "mobx-state-tree";

export default types.model("AchievementStore", {
    text: types.string,
    illustrationUrl: types.string
});
