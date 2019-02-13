import {types} from "mobx-state-tree";
import AtticStore from "./AtticStore/AtticStore";
import HypeStore from "./HypeStore/HypeStore";
import OptionsStore from "./OptionsStore/OptionsStore";

export default types.model({
    attic: AtticStore,
    hype: HypeStore,
    options: OptionsStore,
    pipo: types.maybe(types.string),
    clueEvent: types.maybe(types.string),
    gameEnded: false
})
    .actions(self =>
        ({
            setPipo(state) {
                self.pipo = state;
            },
            setClueEvent(objectKindType) {
                self.clueEvent = objectKindType
            },
            setGameEnded(val) {
                self.gameEnded = !!val;
            }
        })
    )
    .create({
    attic: AtticStore.create({
        electric: {parcelsNumber: 0, clueEventLaunched: false, parcelsNumberLimit: 5},
        furniture: {parcelsNumber: 0, clueEventLaunched: false, parcelsNumberLimit: 1000},
        mobility: {parcelsNumber: 0, clueEventLaunched: false, parcelsNumberLimit: 1000},
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
