import {types} from "mobx-state-tree";

export default types.model("MessageStore", {
    message: types.string,
    expiration: types.number,
    action: types.string
})
    .actions(self =>
        ({

        })
    )
    .create({
        messages: [],
        currentMessage: 0
    });
