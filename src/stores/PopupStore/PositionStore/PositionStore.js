import {types} from "mobx-state-tree";

export default types.model("PositionStore", {
    x: types.number,
    y: types.number
})
    .actions(self => ({
        setPosition(position) {
            self.x = position.x;
            self.y = position.y;
        }
    }))