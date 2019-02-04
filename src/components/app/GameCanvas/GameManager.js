import TimerStore from "../../../stores/TimerStore/TimerStore";
import GameStore from "../../../stores/GameStore/GameStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

export class GameManager {

    static GameManager;

    constructor(scene, atticManager) {
        if (GameManager.GameManager) {
            return GameManager.GameManager;
        } else {
            this.scene = scene;
            GameManager.GameManager = this;
        }
        this.clueEvent = null;
        this.clueEventTimer = null;
        this.objectKindName = null;
        this.atticManager = atticManager;
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
        CatalogStore.getObjectKind(this.objectKindName).setActiveObject(null);
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

    playAfterCatalog(timer, objectKindName) {
        if (this.clueEvent !== null && this.clueEvent !== GameStore.clueEvent) {
            this.objectKindName = objectKindName;
            if (GameStore.attic.isGameOver()) {
                this.atticManager.fall();
            }
            GameStore.setClueEvent(this.clueEvent);
            if (!timer) {
                this.pauseGame();
                this.clueEventTimer = true;
            } else {
                this.clueEventTimer = timer;
            }
            this.clueEvent = null;
        } else if (timer) {
            this.objectKindName = null;
            if (GameStore.attic.isGameOver()) {
                this.atticManager.fall();
            }
            if (typeof timer !== 'boolean') {
                this.playCatalog(timer);
            } else {
                this.playGame();
            }
        } else {
            this.objectKindName = null;
        }
    }
}