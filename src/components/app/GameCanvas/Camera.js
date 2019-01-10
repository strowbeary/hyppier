import * as BABYLON from "babylonjs";

export class Camera {
    constructor(scene) {
        this.camera = new BABYLON.ArcRotateCamera(
            "camera1",
            -3 * Math.PI / 4,
            Math.PI / 3,
            10,
            BABYLON.Vector3.Zero(),
            scene
        );
        // Targets the camera to a particular position. In this case the scene origin
        this.camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        this.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        this.camera.checkCollisions = true;
        this.camera.maxCameraSpeed = 0.05;
        return this.camera;
    }

    attachControl(canvas) {
        this.camera.attachControl(canvas);
    }
}
