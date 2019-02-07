import GameStore from "./stores/GameStore/GameStore";
import CatalogStore from "./stores/CatalogStore/CatalogStore";
import {TimerManager} from "./utils/TimerManager";
import CameraStore from "./stores/CameraStore/CameraStore";
import {onPatch} from "mobx-state-tree";

export class GameManager {

    constructor(scene, atticManager) {
        this.scene = scene;
        this.clueEvent = null;
        this.objectKindName = null;
        this.objectKindType = null;
        this.atticManager = atticManager;
        onPatch(CameraStore, (patch) => {
            if(patch.path.includes("meshName")) {
                if(patch.value === "Attic") {
                    this.pauseGame();
                    GameStore.attic.setAtticVisibility(true);
                }
                if(patch.value === "") {
                    GameStore.attic.setAtticVisibility(false);
                }
            }
        });
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

        this.playGame();

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
            this.playGame();
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
