import GameStore from "../stores/GameStore/GameStore";

const timers = [];

export const TimerManager = {
    stopAll() {
        timers.forEach(timer => {timer && timer.stop && timer.stop()});
    },
    startAll() {
        timers.forEach(timer => {timer && timer.start && timer.start()});
    },
    pauseAll() {
        timers.forEach(timer => {timer && timer.pause && timer.pause()});
    },
    pauseAllExcept(timerId) {
        timers.forEach((timer, id) => {
            if (id !== timerId && timer && timer.stop) timer.stop()
        });
    },
    startAllExcept(timerId) {
        timers.forEach((timer, id) => {
            if (id !== timerId && timer && timer.start) timer.start()
        });
    }
};

export function createTimer(duration) {
    let finishListeners = [];
    let loopHooks = [];
    let animationRequest;
    let paused = false;
    let ended = false;
    let running = false;
    let destroyed = false;
    let startTime = 0;
    let pauseTime = 0;
    let metaElapsedTime = 0;

    function onFinish(listener) {
        finishListeners.push(listener);
        return finishListeners.length - 1;
    }

    function addLoopHook(hook) {
        loopHooks.push(hook);
        return loopHooks.length - 1;
    }

    function start() {
        if (!running && !ended) {
            if (!ended && paused) {
                startTime += performance.now() - pauseTime;
            } else if (!ended && !paused) {
                startTime = performance.now();
            }
            paused = false;
            running = true;
            loop();
        }
    }

    function stop() {
        cancelAnimationFrame(animationRequest);
        pause();
        metaElapsedTime = 0;
        startTime = 0;
        pauseTime = 0;
        running = false;
        ended = false;
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
        if (!ended && !paused) {
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
    }

    const timer = new Proxy({
        onFinish,
        addLoopHook,
        start,
        stop,
        pause,
        setDuration,
        destroy,
        timerId: timers.length
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
