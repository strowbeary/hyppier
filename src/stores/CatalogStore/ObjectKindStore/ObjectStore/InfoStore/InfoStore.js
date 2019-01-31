import {types} from "mobx-state-tree";

export default types.model("InfoStore", {
    slogan: types.string,
    url: types.string
});
