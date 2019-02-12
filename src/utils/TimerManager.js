import GameStore from "../stores/GameStore/GameStore";
import {onPatch} from "mobx-state-tree";

const timers = [];
let timerException;

export const TimerManager = {
    setTimerException(timerId) {
        timerException = timerId;
    },
    stopAll() {
        timers.forEach(timer => {timer && timer.stop && timer.stop()});
    },
    startAll() {
        timers.forEach(timer => {
            if (timer && timer.start) {
                if (!timer.hasStarted()) {
                    timer.setDuration(Math.round(timer.getDuration() / (Math.random() + 1)));
                }
                timer.start()
            }
        });
    },
    pauseAll() {
        timers.forEach(timer => {timer && timer.pause && timer.pause()});
    },
    pauseAllExcept() {
        timers.forEach((timer, id) => {
            if (id !== timerException && timer && timer.pause) timer.pause()
        });
    },
    pauseExcept() {
        if (this.timers[timerException] && this.timers[timerException].pause) {
            this.timers[timerException].pause();
        }
    }
};

export function createTimer(originalDuration) {
    let finishListeners = [];
    let startListeners = [];
    let loopHooks = [];
    let animationRequest;
    let paused = false;
    let ended = false;
    let running = false;
    let destroyed = false;
    let startTime = 0;
    let pauseTime = 0;
    let metaElapsedTime = 0;
    let locked = false;
    let duration = originalDuration - (originalDuration / 2) * Math.abs(0.5 - Math.max(0.5, GameStore.hype.level));


    onPatch(GameStore.hype, patch => {
        if(patch.path.includes("level")) {
            duration = originalDuration - (originalDuration / 2) * Math.abs(0.5 - Math.max(0.5, GameStore.hype.level));
        }
    });

    function onFinish(listener) {
        finishListeners.push(listener);
        return finishListeners.length - 1;
    }
    function onStart(listener) {
        startListeners.push(listener);
        return startListeners.length - 1;
    }

    function addLoopHook(hook) {
        loopHooks.push(hook);
        return loopHooks.length - 1;
    }

    function start() {
        if (!running && !ended && !locked) {
            if (!ended && paused) {
                startTime += performance.now() - pauseTime;
            } else if (!ended && !paused) {
                startTime = performance.now();
            }
            paused = false;
            running = true;
            loop();
            startListeners.forEach(listener => listener());
        }
    }

    function stop() {
        if(!locked) {
            cancelAnimationFrame(animationRequest);
            pause();
            metaElapsedTime = 0;
            startTime = 0;
            pauseTime = 0;
            running = false;
            ended = false;

        }
    }

    function hasStarted() {
        return startTime > 0;
    }

    function loop() {
        metaElapsedTime = (performance.now() - startTime);
        loopHooks.forEach(hook => hook({
            duration,
            elapsedTime: Math.min(Math.max(metaElapsedTime, 0), duration),
            remainingTime: Math.max(duration - metaElapsedTime, 0),
            running: running
        }));
        if (metaElapsedTime >= duration) {
            ended = true;
            running = false;
            finishListeners.forEach(listener => listener());
        }
        if (paused || ended) {
            cancelAnimationFrame(animationRequest)
        } else {
            animationRequest = requestAnimationFrame(loop);
        }
    }

    function pause() {
        if (!ended && !paused && !locked) {
            pauseTime = performance.now();
            paused = true;
            running = false;
        }
    }

    function setDuration(newDuration) {
        originalDuration = newDuration;
        duration = originalDuration - (originalDuration / 2) * Math.abs(0.5 - Math.max(0.5, GameStore.hype.level));
    }

    function getDuration() {
        return duration;
    }

    function destroy() {
        destroyed = true;
        loopHooks = [];
        finishListeners = [];
        delete timers[timer.timerId];
    }

    function lock() {
        locked = true;
    }

    function unlock() {
        locked = false;
    }
    const timer = new Proxy({
        onFinish,
        addLoopHook,
        start,
        stop,
        pause,
        setDuration,
        destroy,
        onStart,
        timerId: timers.length,
        lock,
        unlock,
        hasStarted,
        getDuration
    }, {
        get(target, prop) {
            if (!destroyed) {
                return target[prop];
            }
        },
        set() {
            return false
        }
    });
    timers.push(timer);
    return timer;
}
