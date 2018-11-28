import {types} from "mobx-state-tree";
import AtticStore from "./AtticStore";
import HypeStore from "./HypeStore";
import RoomStore from "./RoomStore";
import OptionsStore from "./OptionsStore";

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
    options: OptionsStore.create()
})
