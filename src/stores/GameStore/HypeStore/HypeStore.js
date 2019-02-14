import {types} from "mobx-state-tree";

export default types.model("HypeStore", {
    level: types.optional(types.refinement(types.number, value => (value >= 0 && value <= 1)), 0)
})
    .actions(self => ({
        setLevelByDiff(diff) {
            if (self.level + diff <= 1 && self.level + diff >= 0) {
                self.level += diff;
            } else if (self.level + diff < 0) {
                self.level = 0;
            } else if (self.level + diff > 1) {
                self.level = 1;
            }
        }
    }))
    .views(self => ({
        isGameWon() {
            return self.level === 0;
        }
    }));
