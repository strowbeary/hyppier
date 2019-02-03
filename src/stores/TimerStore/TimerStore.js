import {types} from "mobx-state-tree";
import CountdownStore from "./CountdownStore/CountdownStore";

export default types.model("TimerStore", {
    countdowns: types.array(CountdownStore)
})
    .actions(self => {
        return {
            pauseAllExcept(countdownValue) {
                self.countdowns.filter(countdown => countdown !== countdownValue).forEach(tm => tm.pause());
            },
            startAllExcept(countdownValue) {
                self.countdowns.filter(countdown => countdown !== countdownValue).forEach(tm => tm.start());
            },
            pauseAll() {
                self.countdowns.forEach(tm => tm.pause());
            },
            startAll() {
                self.countdowns.forEach(tm => tm.start());
            },
            stopAll() {
                self.countdowns.forEach(tm => tm.stop());
            },
            create(duration) {
                const newTimeManager = CountdownStore.create({
                    duration: duration
                });
                self.countdowns.push(newTimeManager);
                return newTimeManager;
            }
        }
    })
    .create({
        countdowns: []
    });
