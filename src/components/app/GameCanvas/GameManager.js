import GameStore from "../../../stores/GameStore/GameStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {TimerManager} from "../../../utils/TimerManager";

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
        TimerManager.pauseAllExcept(countdown);
        GameStore.options.setPause(true);
        this.scene.animatables
            .filter(animatable => animatable.getRuntimeAnimationByTargetProperty("scalingDeterminant") === null)
            .forEach(animatable => animatable.pause());
    }

    playCatalog(countdown) {
        TimerManager.startAllExcept(countdown);
        GameStore.options.setPause(false);
        this.scene.animatables.forEach(animatable => animatable.restart())
    }

    pauseGame() {
        TimerManager.pauseAll();
        GameStore.options.setPause(true);
        this.scene.animatables
            .filter(animatable => animatable.getRuntimeAnimationByTargetProperty("scalingDeterminant") === null)
            .forEach(animatable => animatable.pause())
    }

    playGame() {
        TimerManager.startAll();
        GameStore.options.setPause(false);
        this.scene.animatables.forEach(animatable => animatable.restart())
    }

    playAfterClueEvent() {
        const lambdaMesh = CatalogStore.getObjectKind(this.objectKindName).objects[CatalogStore.getObjectKind(this.objectKindName).activeObject].getModel();
        const clone = lambdaMesh.clone;
        if (clone.length > 0) {
            const lastClone = clone[clone.length - 1];
            lambdaMesh.launchCloneDisappearAnimation(() => this.scene.removeMesh(lastClone));
        } else {
            CatalogStore.getObjectKind(this.objectKindName).setActiveObject(null);
        }
        GameStore.setClueEvent("");
        if (GameStore.attic.isGameOver()) {
            this.atticManager.fall();
        }
        this.playGame();
        this.objectKindName = null;
    }

    playAfterCatalog(timer, objectKindName) {
        if (this.clueEvent !== null && this.clueEvent !== GameStore.clueEvent) {
            this.objectKindName = objectKindName;
            GameStore.setClueEvent(this.clueEvent);
            if (!timer) {
                this.pauseGame();
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