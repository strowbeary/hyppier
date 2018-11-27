import {types} from "mobx-state-tree";

export const Countdown = types.model("Todo", {
    duration: types.number,
    elapsedTime: 0,
    startTime: 0,
    pauseTime: 0,
    ended: false,
    paused: true,
    req: 0
})
    .views(self => {
        return {
            get remainingTime() {
                return (self.startTime + self.duration) - performance.now()
            }
        }
    })
    .actions(self => ({
        _loop() {
            self.elapsedTime = performance.now() - self.startTime;
            if (self.elapsedTime >= self.duration) {
                self.ended = true;
            }
            if (!self.ended) {
                self.req = requestAnimationFrame(() => this._loop());
            }
            if (self.paused) {
                console.log("paused");
                cancelAnimationFrame(self.req);
            }
        },
        pause() {
            if (!self.ended && !self.paused) {
                self.pauseTime = performance.now();
                self.paused = true;
            }
        },
        start() {
            if (self.ended) {
                this.reset();
            }
            if (!self.ended && self.paused) {
                self.startTime += performance.now() - self.pauseTime;
            } else {
                self.startTime = performance.now();
            }
            self.paused = false;
            this._loop();
            console.log("started");
        },
        reset() {
            self.elapsedTime = 0;
            self.startTime = 0;
            self.pauseTime = 0;
            self.ended = false;
            self.paused = true;
        }
    }));


const TimeManager = types.model("TimeManager", {
    countdowns: types.array(Countdown)
})
    .actions(self => {
        return {
            pauseAll() {
                self.countdowns.forEach(tm => tm.pause());
            },
            startAll() {
                self.countdowns.forEach(tm => tm.start());
            },
            create(duration) {
                const newTimeManager = Countdown.create({
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

export default TimeManager;
