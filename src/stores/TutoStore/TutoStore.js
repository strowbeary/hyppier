import {types} from "mobx-state-tree";
import MessageStore from "./MessageStore/MessageStore";

export default types.model("TutoStore", {
    messages: types.array(MessageStore),
    currentMessage: types.number
})
    .actions(self => {
        return {
        }
    })
    .create({
        messages: [],
        currentMessage: 0
    });
