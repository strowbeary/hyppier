import * as BABYLON from "babylonjs";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import {GameManager} from "./GameManager";
import GameStore from "../../../stores/GameStore/GameStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";

export class CameraManager {

    static CATALOG_OFFSET = new BABYLON.Vector3(-0.2, 0, 0);

    static lerp(currentTime, startValue, endValue, duration) {
        currentTime /= duration;
        return (1 - currentTime) * startValue + currentTime * endValue;
    }

    static easeOutQuad (currentTime, startValue, deltaValue, duration) {
        currentTime /= duration;
        return -deltaValue * currentTime * (currentTime-2) + startValue;
    };
    static easeInQuad(currentTime, startValue, deltaValue, duration) {
        currentTime /= duration;
        return deltaValue * currentTime * currentTime + startValue;
    }
    static easeInOutQuad (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

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
        ObjectKindUI.refs.filter(ref => {return ref !== null}).forEach(ref => ref.updatePosition());
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
        const FRAME_NUMBER = 30;

        const fromDistance = this.distance;

        let i = 0;
        const animation = () => {

            this.distance = CameraManager.easeInOutQuad(i, fromDistance, toDistance - fromDistance, FRAME_NUMBER);
            this.camera.target.x = CameraManager.easeInOutQuad(i, fromPosition.x, toPosition.x - fromPosition.x, FRAME_NUMBER);
            this.camera.target.y = CameraManager.easeInOutQuad(i, fromPosition.y, toPosition.y - fromPosition.y, FRAME_NUMBER);
            this.camera.target.z = CameraManager.easeInOutQuad(i, fromPosition.z, toPosition.z - fromPosition.z, FRAME_NUMBER);

            if (i < FRAME_NUMBER) {
                this.updateCamera();
                this.animationRequest = requestAnimationFrame(animation)
            } else {
                cancelAnimationFrame(this.animationRequest);
                this.animationRequest = null;
            }
            i++;
        };
        this.animationRequest = requestAnimationFrame(animation);

    }

}
