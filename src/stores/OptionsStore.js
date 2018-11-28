import {types} from "mobx-state-tree";

export default types.model("OptionsStore", {
    isSoundEnabled: true,
    isFirstTime: true,
    isPaused: false,
    isTutoEnded: false
})
    .actions(self => ({
        afterCreate() {
            console.log(typeof sessionStorage.getItem("hyppierOptions"));
            if(typeof sessionStorage.getItem("hyppierOptions") !== "undefined") {
                const savedOptions = JSON.parse(sessionStorage.getItem("hyppierOptions"));
                self.isSoundEnabled = savedOptions.isSoundEnabled;
                self.isFirstTime = savedOptions.isFirstTime;
                self.isTutoEnded = savedOptions.isTutoEnded;
            } else {
                sessionStorage.setItem("hyppierOptions", JSON.stringify(self));
            }
        }
    }))
