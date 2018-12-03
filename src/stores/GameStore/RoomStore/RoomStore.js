import {types} from "mobx-state-tree";
import PlaceStore from "./PlaceStore/PlaceStore";

export default types.model("RoomStore", {
    places: types.array(PlaceStore)
});
