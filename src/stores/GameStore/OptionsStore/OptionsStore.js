import {types} from "mobx-state-tree";

export default types.model("OptionsStore", {
    isSoundEnabled: true,
    isPaused: false,
    isTutoEnded: false
})
    .postProcessSnapshot(snapshot => {
        const {
            isTutoEnded,
            isSoundEnabled
        } = snapshot;
        sessionStorage.setItem("hyppierOptions", JSON.stringify({
            isSoundEnabled,
            isTutoEnded
        }));
        return snapshot;
    })
    .actions(self => ({
        setPause(isPaused) {
            self.isPaused = isPaused;
        },
        setTutoEnded(isTutoEnded) {
            self.isTutoEnded = isTutoEnded;
        },
        setSoundEnabled(isSoundEnabled) {
            self.isSoundEnabled = isSoundEnabled;
        },
        reset() {
            self.isSoundEnabled = true;
            self.isPaused = false;
            self.isTutoEnded = false;
        }
    }))
