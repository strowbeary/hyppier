import * as BABYLON from "babylonjs";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import {GameManager} from "./GameManager";
import GameStore from "../../../stores/GameStore/GameStore";

export class CameraManager {

    static CATALOG_OFFSET = new BABYLON.Vector3(-0.2, 0, 0);

    initialValues = {
        width: window.innerWidth,
        height: window.innerHeight,
        distance: 5
    };

    distance = this.initialValues.distance;

    constructor(scene) {
        this.scene = scene;
        this.camera = new BABYLON.ArcRotateCamera(
            "camera1",
            -3 * Math.PI / 4,
            Math.PI / 3,
            10,
            BABYLON.Vector3.Zero(),
            scene
        );
        // Targets the camera to a particular position. In this case the scene origin
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.updateCamera();
        this.camera.checkCollisions = true;
        this.camera.maxCameraSpeed = 0.05;
    }

    attachControl(canvas) {
        this.camera.attachControl(canvas);
    }

    goToAttic() {
        CameraStore.setTarget("Grenier");
        GameManager.GameManager && GameManager.GameManager.pauseGame();
        GameStore.attic.setAtticVisibility(true);
    }

    goToRoom() {
        CameraStore.setTarget();
        GameManager.GameManager && GameManager.GameManager.playGame();
        GameStore.attic.setAtticVisibility(false);
    }

    updateCamera() {
        const ratio = this.initialValues.height / this.initialValues.width;
        const distance = this.distance / (window.innerWidth / this.initialValues.width);
        this.camera.orthoTop = distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoBottom = -distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoLeft = -distance * ratio * (window.innerWidth / this.initialValues.height);
        this.camera.orthoRight = distance * ratio * (window.innerWidth / this.initialValues.height);
    }

    setTarget(mesh, offset = new BABYLON.Vector3(0, 0, 0)) {
        let toDistance = this.initialValues.distance;
        let toPosition = BABYLON.Vector3.Zero();
        if(typeof mesh !== "undefined" && mesh !== "") {
            if(typeof mesh === "string") {
                mesh = this.scene.getMeshByName(mesh);
            }
            toDistance = Math.ceil(Math.max(Math.max(
                mesh.getBoundingInfo().boundingBox.maximum.y * mesh.scaling.y,
                mesh.getBoundingInfo().boundingBox.maximum.x * mesh.scaling.x,
                mesh.getBoundingInfo().boundingBox.maximum.z * mesh.scaling.z
            )) * 2.5);
            toPosition = mesh.position.clone();
        }

        toPosition.addInPlace(offset);

        this.distance = Math.round(this.distance);
        let fromPosition = this.camera.target;
        if(this.animationRequest) {
            cancelAnimationFrame(this.animationRequest);
        }
        const animation = () => {
            this.distance = this.distance + 0.1 * (toDistance - this.distance);
            this.camera.target.x = fromPosition.x + 0.1 * (toPosition.x - fromPosition.x);
            this.camera.target.y = fromPosition.y + 0.1 * (toPosition.y - fromPosition.y);
            this.camera.target.z = fromPosition.z + 0.1 * (toPosition.z - fromPosition.z);
            if (Math.abs(this.distance-toDistance).toFixed(3) > 0 || 
                BABYLON.Vector3.Distance(this.camera.target, toPosition).toFixed(4) > 0
            ) {
                this.updateCamera();
                this.animationRequest = requestAnimationFrame(animation)
            } else {
                cancelAnimationFrame(this.animationRequest);
                this.animationRequest = null;
            }
        };
        this.animationRequest = requestAnimationFrame(animation);

    }

}
