import * as BABYLON from "babylonjs";
import ambiance from "../../../assets/sounds/ambiance.mp3";
import SFXBoxDrop from "../../../assets/sounds/SFX-Box_Drop.wav";
import SFXClick from "../../../assets/sounds/SFX-Click.wav";
import SFXElectricityOut from "../../../assets/sounds/SFX-Electricity_out.wav";
import SFXError from "../../../assets/sounds/SFX-Error.mp3";
import SFXLadderdrop from "../../../assets/sounds/SFX-Ladder-drop.wav";
import SFXNotif from "../../../assets/sounds/SFX-Notif.mp3";
import SFXToast from "../../../assets/sounds/SFX-Toast.wav";
import nock from "../../../assets/sounds/nock.wav";
import SFXCrack from "../../../assets/sounds/SFX-Crack.wav";
import SFXCrash from "../../../assets/sounds/SFX-Crash.wav";
import SFXPositive from "../../../assets/sounds/SFX-Positive.mp3";

let SoundManagerInstance;

class SoundManager {

    constructor(scene) {
        this.scene = scene;
        this.music = new BABYLON.Sound("Music", ambiance, this.scene, null, {loop: true, autoplay: true, volume: 0.05});
        this.dropParcel = new BABYLON.Sound("Parcel", SFXBoxDrop, this.scene, null, {volume: 0.1});
        this.spacePress = new BABYLON.Sound("Spacepress", SFXClick, this.scene, null, {volume: 0.2});
        this.clueEventElectric = new BABYLON.Sound("ElectricityOut", SFXElectricityOut, this.scene, null, {volume: 0.2});
        this.catalogError = new BABYLON.Sound("CatalogError", SFXError, this.scene, null, {volume: 0.5});
        this.ladderDrop = new BABYLON.Sound("LadderDrop", SFXLadderdrop, this.scene, null, {volume: 0.2});
        this.notifAppear = new BABYLON.Sound("NotifAppear", SFXNotif, this.scene, null, {volume: 0.75});
        this.toastAppear = new BABYLON.Sound("ToastAppear", SFXToast, this.scene, null, {volume: 0.5});
        this.objectTileAppear = new BABYLON.Sound("nock1", nock, this.scene, null, {volume: 0.35});
        this.atticCrack = new BABYLON.Sound("AtticCrack", SFXCrack, this.scene, null, {volume: 0.4});
        this.atticCrash = new BABYLON.Sound("AtticCrash", SFXCrash, this.scene, null, {volume: 0.1});
        this.positiveFeedback = new BABYLON.Sound("SFXPositive", SFXPositive, this.scene, null, {volume: 0.1});
        SoundManagerInstance = this;


    }

    setGlobalVolume(value) {
        BABYLON.Engine.audioEngine.setGlobalVolume(value);
    }
}

export {SoundManager, SoundManagerInstance};
