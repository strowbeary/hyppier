import {types} from "mobx-state-tree";
import AtticStore from "./AtticStore/AtticStore";
import HypeStore from "./HypeStore/HypeStore";
import RoomStore from "./RoomStore/RoomStore";
import OptionsStore from "./OptionsStore/OptionsStore";

export default types.model({
    attic: AtticStore,
    hype: HypeStore,
    room: RoomStore,
    options: OptionsStore
}).create({
    attic: AtticStore.create({

    }),
    hype: HypeStore.create({

    }),
    room: RoomStore.create({

    }),
    options: OptionsStore.create((() => {
        if (sessionStorage.getItem("hyppierOptions") !== null){
            return JSON.parse(sessionStorage.getItem("hyppierOptions"))
        }
    })())
})
