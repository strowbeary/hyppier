import * as BABYLON from "babylonjs";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import {GameManager} from "../../../GameManager";
import GameStore from "../../../stores/GameStore/GameStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
const EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

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

        const fromDistance = this.distance;
        let i = 0;
        let step = 1 / 30;
        console.log(step);
        const animation = () => {
            let t = EasingFunctions.linear(i);
            this.distance = (1 - t) * fromDistance + t * toDistance;
            this.camera.target.x = (1 - t) * fromPosition.x + t * toPosition.x;
            this.camera.target.y = (1 - t) * fromPosition.y + t * toPosition.y;
            this.camera.target.z = (1 - t) * fromPosition.z + t * toPosition.z;

            if (i <= 1) {
                this.updateCamera();
                this.animationRequest = requestAnimationFrame(animation)
            } else {
                cancelAnimationFrame(this.animationRequest);
                this.animationRequest = null;
            }
            i += step;
        };
        this.animationRequest = requestAnimationFrame(animation);

    }

}
