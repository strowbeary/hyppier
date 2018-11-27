const instances = [];
const TimeoutEvent = new CustomEvent("timeout");

function play() { //do this after pause when start is clicked
    this.startTime += performance.now() - this.pauseTime;
    this.running = true;
    update.apply(this);
    return this;
}

function restart() {
    this.reset();
    update.apply(this);
    return this;
}

function update() {
    if(this.remainingTime < 0 && this.running) {
        this.pause();
        this.reset();
        this.dispatchEvent(TimeoutEvent);
    } else {
        this.req = requestAnimationFrame(update.bind(this));
    }
}

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

    start() {
        if (!this.started) {
            this.started = true;
            this.running = true;
            this.startTime = performance.now();
            update.apply(this);
            return this;
        } else if (!this.running && (this.pauseTime - this.startTime) <  this.duration) {
            play.apply(this);
        } else {
            restart.apply(this);
        }
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



    get elapsedTime() {
        return performance.now() - this.startTime;
    }

    get remainingTime() {
        return (this.startTime + this.duration) - performance.now()
    }

}

