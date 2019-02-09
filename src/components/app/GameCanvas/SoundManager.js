import * as BABYLON from "babylonjs";
import ambiance from "../../../assets/sounds/ambiance.mp3";

export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.music = new BABYLON.Sound("Music", ambiance, this.scene, null, { loop: true, autoplay: true, volume: 0.2 });
    }

}
