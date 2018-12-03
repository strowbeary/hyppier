import {types} from "mobx-state-tree";

export default types.model("HypeStore", {
    level: types.optional(types.refinement(types.number, value => (value >= 0 && value <= 1)), 0)
})
    .actions(self => ({
        setLevel(level) {
            self.level = level;
        }
    }))
