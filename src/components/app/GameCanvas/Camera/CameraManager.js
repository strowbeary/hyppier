import * as BABYLON from "babylonjs";
import {cameraBoundariesAnim} from "./CameraUtils";

export class CameraManager {

    initialValues = {
        width: window.innerWidth,
        height: window.innerHeight,
        distance: 10
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

    updateCamera() {
        const ratio = this.initialValues.height / this.initialValues.width;
        const distance = this.distance / (window.innerWidth / this.initialValues.width);
        this.camera.orthoTop = distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoBottom = -distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoLeft = -distance * ratio * (window.innerWidth / this.initialValues.height);
        this.camera.orthoRight = distance * ratio * (window.innerWidth / this.initialValues.height);
    }

    setTarget(mesh) {
        let toDistance = this.initialValues.distance;
        let toPosition = BABYLON.Vector3.Zero();
        if(typeof mesh !== "undefined") {
            toDistance = Math.ceil(Math.max(Math.max(
                mesh.getBoundingInfo().boundingBox.maximum.y * mesh.scaling.y,
                mesh.getBoundingInfo().boundingBox.maximum.x * mesh.scaling.x,
                mesh.getBoundingInfo().boundingBox.maximum.z * mesh.scaling.z
            )) * 3);
            toPosition = mesh.position.clone();
        }


        this.distance = Math.round(this.distance);
        console.log(this.distance, ">", toDistance);
        let fromPosition = this.camera.target;
        if(toDistance < this.distance) {
            toPosition.y += 0.3 * toDistance;
            toPosition.x -= 0.5 * toDistance;
        }
        const animation = () => {
            this.distance = this.distance + 0.1 * (toDistance - this.distance);

            this.camera.target.x = fromPosition.x + 0.1 * (toPosition.x - fromPosition.x);
            this.camera.target.y = fromPosition.y + 0.1 * (toPosition.y - fromPosition.y);
            this.camera.target.z = fromPosition.z + 0.1 * (toPosition.z - fromPosition.z);

            this.updateCamera();

            if (this.distance !== toDistance) {
                animationRequest = requestAnimationFrame(animation)
            } else {
                cancelAnimationFrame(animationRequest);
            }
        };
        let animationRequest = requestAnimationFrame(animation);

    }

}
