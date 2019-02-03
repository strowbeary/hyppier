import TimerStore from "../../../stores/TimerStore/TimerStore";
import GameStore from "../../../stores/GameStore/GameStore";

export class GameManager {

    static GameManager;

    constructor(scene) {
        if (GameManager.GameManager) {
            return GameManager.GameManager;
        } else {
            this.scene = scene;
            GameManager.GameManager = this;
        }
        this.clueEvent = null;
        this.clueEventTimer = null;
    }

    pauseCatalog(countdown) {
        TimerStore.pauseAllExcept(countdown);
        GameStore.options.setPause(true);
        this.scene.animatables
            .filter(animatable => animatable.getRuntimeAnimationByTargetProperty("scalingDeterminant") === null)
            .forEach(animatable => animatable.pause());
    }

    playCatalog(countdown) {
        TimerStore.startAllExcept(countdown);
        GameStore.options.setPause(false);
        this.scene.animatables.forEach(animatable => animatable.restart())
    }

    pauseGame() {
        TimerStore.pauseAll();
        GameStore.options.setPause(true);
        this.scene.animatables
            .filter(animatable => animatable.getRuntimeAnimationByTargetProperty("scalingDeterminant") === null)
            .forEach(animatable => animatable.pause())
    }

    playGame() {
        TimerStore.startAll();
        GameStore.options.setPause(false);
        this.scene.animatables.forEach(animatable => animatable.restart())
    }

    playAfterClueEvent() {
        GameStore.setClueEvent("");
        if (this.clueEventTimer) {
            if (typeof this.clueEventTimer !== 'boolean') {
                this.playCatalog(this.clueEventTimer);
            } else {
                this.playGame();
            }
            this.clueEventTimer = null;
        }
    }

    playAfterCatalog(timer) {
        if (this.clueEvent !== null && this.clueEvent !== GameStore.clueEvent) {
            GameStore.setClueEvent(this.clueEvent);
            if (!timer) {
                this.pauseGame();
                this.clueEventTimer = true;
            } else {
                this.clueEventTimer = timer;
            }
            this.clueEvent = null;
        } else if (timer) {
            if (typeof timer !== 'boolean') {
                this.playCatalog(timer);
            } else {
                this.playGame();
            }
        }
    }
}