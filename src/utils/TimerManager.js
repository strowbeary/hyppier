import GameStore from "../stores/GameStore/GameStore";

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
        timers.forEach(timer => {timer && timer.start && timer.start()});
    },
    pauseAll() {
        timers.forEach(timer => {timer && timer.pause && timer.pause()});
    },
    pauseAllExcept() {
        timers.forEach((timer, id) => {
            if (id !== timerException && timer && timer.stop) timer.stop()
        });
    }
};

export function createTimer(duration) {
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

    function loop() {
        metaElapsedTime = GameStore.hype.level * (performance.now() - startTime);
        loopHooks.forEach(hook => hook({
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
        duration = newDuration;
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
        unlock
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
