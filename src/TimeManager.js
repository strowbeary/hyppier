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
        this.pauseOffset = 0;
        this.startTime = 0;
        this.pauseTime = 0;
        this.ended = false;
        this.running = false;
    }

    pause() {
        cancelAnimationFrame(this.req);
        this.pauseTime = performance.now(); //startTime + elapsedTime before Pause
        this.running = false;
        return this;
    }

    reset() {
        if(this.ended) {
            this.pauseOffset = 0;
            this.startTime = performance.now();
            this.pauseTime = 0;
            this.ended = false;
        }
    }

    start() {
        if(!this.running) {
            this.running = true;
            this.startTime += performance.now() - this.pauseTime; //on rajoute à l'heure de départ, le temps écoulé pendant la pause
        }
        this.update();
        return this;
    }

    update() {
        if(this.remainingTime < 0) {
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
