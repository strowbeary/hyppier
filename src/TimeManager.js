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
        this.metaduration = duration;
        this.startTime = 0;
    }

    pause() {
        cancelAnimationFrame(this.req);
        this.metaduration = this.metaduration - this.currentTimeout;
        return this;
    }

    start() {
        this.startTime = performance.now();
        this.update();
        return this;
    }

    update() {
        if(performance.now() >= (this.startTime + this.metaduration)) {
            this.dispatchEvent(TimeoutEvent);
        } else {
            this.req = requestAnimationFrame(this.update.bind(this));
        }
    }

    get currentTimeout() {
        return performance.now() - this.startTime;
    }

}
