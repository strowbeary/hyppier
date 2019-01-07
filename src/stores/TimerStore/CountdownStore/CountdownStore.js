import {types} from "mobx-state-tree";
import GameStore from "../../GameStore/GameStore";

export default types
    .model(
    "TimerStore",
    {
        duration: types.number,
        metaElapsedTime: 0,
        startTime: 0,
        pauseTime: 0,
        ended: false,
        paused: true,
        running: false,
        req: 0
    })
    .views(self => {
        return {
            get remainingTime() {
                return self.duration - self.metaElapsedTime;
            },
            get elapsedTime() {
                return Math.min(Math.max(self.metaElapsedTime, 0), self.duration)
            }
        }
    })
    .actions(self => ({
        _loop() {
            self.metaElapsedTime = GameStore.hype.level * (performance.now() - self.startTime);
            if (self.metaElapsedTime >= self.duration) {
                self.ended = true;
                self.running = false;
            }
            if (!self.ended) {
                self.req = requestAnimationFrame(() => this._loop());
            }
            if (self.paused) {
                cancelAnimationFrame(self.req);
            }
        },
        pause() {
            if (!self.ended && !self.paused) {
                self.pauseTime = performance.now();
                self.paused = true;
                self.running = false;
            }
        },
        start() {
            if (!self.running && !self.ended) {
                if (!self.ended && self.paused) {
                    self.startTime += performance.now() - self.pauseTime;
                } else if (!self.ended && !self.paused) {
                    self.startTime = performance.now();
                }
                self.paused = false;
                self.running = true;
                this._loop();
                console.log("started");
            }
        },
        stop() {
            cancelAnimationFrame(self.req);
            this.pause();
            self.metaElapsedTime = 0;
            self.startTime = 0;
            self.pauseTime = 0;
            self.running = false;
            self.ended = false;
        }
    }));

