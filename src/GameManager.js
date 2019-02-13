import GameStore from "./stores/GameStore/GameStore";
import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {TimerManager} from "./utils/TimerManager";

let GameManagerInstance;

class GameManager {

    constructor(scene, atticManager) {
        this.scene = scene;
        this.clueEvent = null;
        this.objectKindName = null;
        this.objectKindType = null;
        this.atticManager = atticManager;
        GameManagerInstance = this;
    }

    pauseGame(fromCatalog) {
        if (fromCatalog) {
            TimerManager.pauseAllExcept();
        } else {
            TimerManager.pauseAll();
        }
        GameStore.options.setPause(true);
        this.scene.animatables
            .forEach(animatable => {
                if (animatable.getAnimations()
                    .map(animation => animation._animation.name.includes("materialDegradation"))
                    .some((e) => e)) {
                    animatable.pause();
                }
            });
    }

    pauseToastTimer() {
        TimerManager.pauseExcept();
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
            lambdaMesh.clones.pop();
        } else {
            CatalogStore.getObjectKind(this.objectKindName).setActiveObject(null);
        }
        this.objectKindName = null;

        this.playGame();

        if (GameStore.attic.isGameOver()) {
            this.atticManager.fall();
            setTimeout(() => {
                this.pauseGame();
                GameStore.setGameEnded(true);
            }, 3500);
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
                this.pauseToastTimer();
            }
        } else {
            this.playGame();
            this.objectKindType = null;
            if (GameStore.attic.isGameOver()) {
                this.atticManager.fall();
                setTimeout(() => {
                    this.pauseGame();
                    GameStore.setGameEnded(true);
                }, 3500);
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

export {GameManager, GameManagerInstance}
