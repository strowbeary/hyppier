const instances = [];
const TimeoutEvent = new CustomEvent("timeout");
export class TimeManager extends EventTarget{

    static pauseAll() {
        instances.forEach(tm => tm.pause());
    }

    static startAll() {
        instances.forEach(tm => tm.start());
    }

    static create(duration) {
        let newTimeManager = new TimeManager(duration);
        instances.push(newTimeManager);
        return newTimeManager
    }

    constructor(duration = 0) {
        super();
        this.duration = duration;
        this.startTime = 0;
        this.pauseTime = 0;
        this.running = false;
        this.started = false;
    }

    pause() {
        if (this.running && this.started) {
            if (this.req) {
                cancelAnimationFrame(this.req);
            }
            this.pauseTime = performance.now(); //startTime + elapsedTime before Pause
            this.running = false;
        }
        return this;
    }

    play() { //do this after pause when start is clicked
        this.startTime += performance.now() - this.pauseTime;
        this.running = true;
        this.update();
        return this;
    }

    reset() {
        if (this.req) {
            cancelAnimationFrame(this.req);
        }
        this.startTime = performance.now();
        this.pauseTime = 0;
        this.running = false;
        this.started = false;
    }

    restart() {
        this.reset();
        this.update();
        return this;
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.running = true;
            this.startTime = performance.now();
            this.update();
            return this;
        } else if (!this.running && (this.pauseTime - this.startTime) <  this.duration) {
            this.play();
        } else {
            this.restart();
        }
    }

    update() {
        if(this.remainingTime < 0 && this.running) {
            this.pause();
            this.reset();
            this.dispatchEvent(TimeoutEvent);
        } else {
            this.req = requestAnimationFrame(this.update.bind(this));
        }
    }

    get elapsedTime() {
        return performance.now() - this.startTime;
    }

    get remainingTime() {
        return (this.startTime + this.duration) - performance.now()
    }

}
