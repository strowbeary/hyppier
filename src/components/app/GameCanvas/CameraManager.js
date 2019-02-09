import * as BABYLON from "babylonjs";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import {onPatch} from "mobx-state-tree";
import {spawn} from "../utils/spawn-worker";

const transitionFinishListener = [];

export class CameraManager {
    static CATALOG_OFFSET = new BABYLON.Vector3(-0.25, 0.1, 0);

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
        //this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.useFramingBehavior = true;
        this.camera.framingBehavior.zoomStopsAnimation = false;
        this.camera.framingBehavior.mode = BABYLON.FramingBehavior.FitFrustumSidesMode;
        this.camera.checkCollisions = true;
        this.camera.maxCameraSpeed = 0.05;

        onPatch(CameraStore, (patch) => {
            if (patch.path.includes("meshName")) {
                this.setTarget(CameraStore.meshName, CameraStore.offset);
            }
        });

        this.scene.beforeCameraRender = () => {
            if (this.camera.framingBehavior.isUserIsMoving) {
                ObjectKindUI.refs.forEach(ref => {
                    if (ref) {
                        ref.updatePosition()
                    }
                });
            }
        }
    }

    onOriginTargeted(listener) {
        transitionFinishListener.push(listener);
    }

    setTarget(mesh) {
        console.log("TARGET", mesh);
        if (mesh === null || mesh === "") {
            this.camera.framingBehavior.radiusScale = 1;
            this.camera.framingBehavior.zoomOnMesh(
                this.scene.getMeshByName("_ROOM.002"),
                false,
                () => {
                    transitionFinishListener.forEach(listener => listener());
                });
        } else {
            if (typeof mesh === "string") {
                mesh = this.scene.getMeshByName(mesh)
            }
            console.log(Math.round((1 - mesh.getBoundingInfo().boundingBox.extendSizeWorld.length()) * 10));
            this.camera.framingBehavior.radiusScale = Math.round((1 - mesh.getBoundingInfo().boundingBox.extendSizeWorld.length()) * 10);
            this.camera.framingBehavior.zoomOnMesh(mesh, false);
        }


    }

}
