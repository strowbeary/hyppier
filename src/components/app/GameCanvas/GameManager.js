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
        this.objectKindName = null;
        this.objectKindType = null;
        this.timer = null;
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

    playAfterClueEventClosed() {
        let lambdaMesh = CatalogStore.getObjectKind(this.objectKindName).objects[CatalogStore.getObjectKind(this.objectKindName).activeObject].getModel();
        const clones = lambdaMesh.clones;
        if (clones.length > 0) {
            const lastClone = clones[clones.length - 1];
            lambdaMesh.launchCloneDisappearAnimation(() => this.scene.removeMesh(lastClone));
        } else {
            CatalogStore.getObjectKind(this.objectKindName).setActiveObject(null);
        }
        this.objectKindName = null;

        if (this.timer !== null) {
            this.playCatalog(this.timer);
            this.timer = null;
        } else {
            this.playGame();
        }
        if (GameStore.attic.isGameOver()) {
            this.atticManager.fall();
        }
    }

    playAfterClueEvent() {
        this.clueEvent = null;
        this.objectKindType = null;
        GameStore.setClueEvent("");
    }

    playAfterCatalog() {
        if (this.clueEvent !== null) {
            if (GameStore.clueEvent !== this.clueEvent) {
                GameStore.setClueEvent(this.clueEvent);
            }
        } else {
            if (typeof this.timer !== 'boolean') {
                this.playGame();
            } else {
                this.playCatalog(this.timer);
            }
            this.timer = null;
            this.objectKindType = null;
            if (GameStore.attic.isGameOver()) {
                this.atticManager.fall();
            }
        }
    }

    playAfterPopup(objectKindName) {
        if (this.clueEvent !== null) { //replacement with ClueEvent
            if (GameStore.clueEvent !== this.clueEvent) {
                this.objectKindName = objectKindName;
                GameStore.setClueEvent(this.clueEvent);
                this.pauseGame();
            }
        } else if (!GameStore.options.isPaused) { //replacement in Popup
            if (GameStore.attic.isGameOver()) {
                this.atticManager.fall();
            }
        }
    }
}