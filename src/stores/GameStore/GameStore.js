import {types} from "mobx-state-tree";
import AtticStore from "./AtticStore/AtticStore";
import HypeStore from "./HypeStore/HypeStore";
import OptionsStore from "./OptionsStore/OptionsStore";

export default types.model({
    attic: AtticStore,
    hype: HypeStore,
    options: OptionsStore
})
    .create({
    attic: AtticStore.create({

    }),
    hype: HypeStore.create({
        level: 0.5
    }),
    options: OptionsStore.create((() => {
        if (sessionStorage.getItem("hyppierOptions") !== null){
            return JSON.parse(sessionStorage.getItem("hyppierOptions"))
        }
    })())
})
