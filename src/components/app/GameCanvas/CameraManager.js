import * as BABYLON from "babylonjs";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import {onPatch} from "mobx-state-tree";

const transitionFinishListener = [];

export class CameraManager {
    static CATALOG_OFFSET = new BABYLON.Vector3(-0.30, 0.1, 0);
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
            30,
            BABYLON.Vector3.Zero(),
            scene
        );

        // Targets the camera to a particular position. In this case the scene origin
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.checkCollisions = true;
        this.prepareFrustum();


        onPatch(CameraStore, (patch) => {
            if (patch.path.includes("meshName")) {
                this.setTarget(CameraStore.meshName, CameraStore.offset);
            }
        });

        /*this.scene.beforeCameraRender = () => {
            if (this.camera) {
                ObjectKindUI.refs.forEach(ref => {
                    if (ref) {
                        ref.updatePosition()
                    }
                });
            }
        }*/
    }

    prepareFrustum() {
        const ratio = this.initialValues.height / this.initialValues.width;
        const distance = this.distance / (window.innerWidth / this.initialValues.width);
        this.camera.orthoTop = distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoBottom = -distance * ratio * (window.innerHeight / this.initialValues.height);
        this.camera.orthoLeft = -distance * ratio * (window.innerWidth / this.initialValues.height);
        this.camera.orthoRight = distance * ratio * (window.innerWidth / this.initialValues.height);
        ObjectKindUI.refs.filter(ref => {
            return ref !== null
        }).forEach(ref => ref.updatePosition());
    }

    onOriginTargeted(listener) {
        transitionFinishListener.push(listener);
    }

    setTarget(mesh) {
        const frame_number = 30;
        let toPosition = BABYLON.Vector3.Zero();
        let scale = 3;
        if(mesh === "Attic") {
            toPosition = this.scene.getMeshByName(mesh).getBoundingInfo().boundingBox.centerWorld;
            scale = 1;
        }
        else if (typeof mesh === "string" && mesh.length > 0) {
            toPosition = this.scene.getMeshByName(mesh).getBoundingInfo().boundingBox.centerWorld.add(CameraManager.CATALOG_OFFSET);
            scale = 1 / 3;
        }
        const Easing = new BABYLON.QuinticEase();
        Easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        this.scene.afterCameraRender = () => {
            ObjectKindUI.refs.forEach(ref => ref &&ref.updatePosition());
        };

        BABYLON.Animation.CreateAndStartAnimation(
            'target',
            this.camera,
            'target',
            30,
            frame_number,
            this.camera.target,
            toPosition,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            Easing);


        BABYLON.Animation.CreateAndStartAnimation(
            'target',
            this.camera,
            'orthoTop',
            30,
            frame_number,
            this.camera.orthoTop,
            this.camera.orthoTop * scale,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            Easing);

        BABYLON.Animation.CreateAndStartAnimation(
            'target',
            this.camera,
            'orthoBottom',
            30,
            frame_number,
            this.camera.orthoBottom,
            this.camera.orthoBottom * scale,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            Easing);

        BABYLON.Animation.CreateAndStartAnimation(
            'target',
            this.camera,
            'orthoLeft',
            30,
            frame_number,
            this.camera.orthoLeft,
            this.camera.orthoLeft * scale,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            Easing);

        BABYLON.Animation.CreateAndStartAnimation(
            'target',
            this.camera,
            'orthoRight',
            30,
            frame_number,
            this.camera.orthoRight,
            this.camera.orthoRight * scale,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            Easing,
            () => {
                this.scene.afterCameraRender = () => {};
                if(toPosition.equals(BABYLON.Vector3.Zero())) {
                    transitionFinishListener.forEach(listener => listener())
                }
            });
    }

}
