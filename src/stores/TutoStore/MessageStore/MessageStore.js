import {types} from "mobx-state-tree";

export default types
    .model("MessageStore",
    {
        text: types.string,
        expiration: types.number,
        action: types.string,
        originTarget: types.string,
        read: types.boolean
    });
