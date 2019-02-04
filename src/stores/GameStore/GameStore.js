import {types} from "mobx-state-tree";
import AtticStore from "./AtticStore/AtticStore";
import HypeStore from "./HypeStore/HypeStore";
import OptionsStore from "./OptionsStore/OptionsStore";

export default types.model({
    attic: AtticStore,
    hype: HypeStore,
    options: OptionsStore,
    pipo: types.maybe(types.string),
    clueEvent: types.maybe(types.string)
})
    .actions(self =>
        ({
            setPipo(state) {
                self.pipo = state;
            },
            setClueEvent(objectKindType) {
                self.clueEvent = objectKindType
            }
        })
    )
    .create({
    attic: AtticStore.create({
        electric: {parcelsNumber: 0, clueEventLaunched: false},
        furniture: {parcelsNumber: 0, clueEventLaunched: false}
    }),
    hype: HypeStore.create({
        level: 0.5
    }),
    pipo: "",
    options: OptionsStore.create((() => {
        if (sessionStorage.getItem("hyppierOptions") !== null){
            return JSON.parse(sessionStorage.getItem("hyppierOptions"))
        }
    })())
})
