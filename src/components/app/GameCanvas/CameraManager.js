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
        distance: 6,
        ratio: window.innerHeight / window.innerWidth
    };

    distance = this.initialValues.distance;

    constructor(scene, gameManager) {
        this.scene = scene;
        this.gameManager = gameManager;
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
        this.updateFrustum();


        onPatch(CameraStore, (patch) => {
            if (patch.path.includes("meshName")) {
                this.setTarget(CameraStore.meshName, CameraStore.offset);
            }
        });

    }

    updateFrustum() {
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

    createAnimations(toPosition) {
        this.camera.animations = [];
        let animationTarget = new BABYLON.Animation("target", "target", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysTarget = [];
        keysTarget.push({
            frame: 0,
            value: this.camera.target
        });
        keysTarget.push({
            frame: 30,
            value: toPosition
        });
        animationTarget.setKeys(keysTarget);

        const Easing = new BABYLON.QuinticEase();
        Easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        animationTarget.setEasingFunction(Easing);

        let animationGroup = new BABYLON.AnimationGroup("Camera");
        animationGroup.addTargetedAnimation(animationTarget, this.camera);

        let animationOrthoTop = new BABYLON.Animation("target", "orthoTop", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysOrthoTop = [];
        keysOrthoTop.push({
            frame: 0,
            value: this.camera.orthoTop
        });
        keysOrthoTop.push({
            frame: 30,
            value: this.distance * this.initialValues.ratio * (window.innerHeight / this.initialValues.height)
        });
        animationOrthoTop.setKeys(keysOrthoTop);

        let animationOrthoLeft = new BABYLON.Animation("target", "orthoLeft", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysOrthoLeft = [];
        keysOrthoLeft.push({
            frame: 0,
            value: this.camera.orthoLeft
        });
        keysOrthoLeft.push({
            frame: 30,
            value: -this.distance * this.initialValues.ratio * (window.innerWidth / this.initialValues.height)
        });
        animationOrthoLeft.setKeys(keysOrthoLeft);

        let animationOrthoRight = new BABYLON.Animation("target", "orthoRight", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysOrthoRight = [];
        keysOrthoRight.push({
            frame: 0,
            value: this.camera.orthoRight
        });
        keysOrthoRight.push({
            frame: 30,
            value: this.distance * this.initialValues.ratio * (window.innerWidth / this.initialValues.height)
        });
        animationOrthoRight.setKeys(keysOrthoRight);

        let animationOrthoBottom = new BABYLON.Animation("target", "orthoBottom", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysOrthoBottom = [];
        keysOrthoBottom.push({
            frame: 0,
            value: this.camera.orthoBottom
        });
        keysOrthoBottom.push({
            frame: 30,
            value: -this.distance * this.initialValues.ratio * (window.innerHeight / this.initialValues.height)
        });
        animationOrthoBottom.setKeys(keysOrthoBottom);

        animationOrthoTop.setEasingFunction(Easing);
        animationOrthoLeft.setEasingFunction(Easing);
        animationOrthoRight.setEasingFunction(Easing);
        animationOrthoBottom.setEasingFunction(Easing);

        animationGroup.addTargetedAnimation(animationOrthoTop, this.camera);
        animationGroup.addTargetedAnimation(animationOrthoLeft, this.camera);
        animationGroup.addTargetedAnimation(animationOrthoBottom, this.camera);
        animationGroup.addTargetedAnimation(animationOrthoRight, this.camera);


        animationGroup.normalize(0, 30);
        animationGroup.play();
        animationGroup.onAnimationGroupEndObservable.add(() => {
            ObjectKindUI.refs.forEach(ref => ref && ref.updatePosition());
            if (toPosition.equals(BABYLON.Vector3.Zero())) {
                transitionFinishListener.forEach(listener => listener())
            }
        });
    }

    setTarget(mesh) {
        let toPosition = BABYLON.Vector3.Zero();
        this.distance = this.initialValues.distance;

        if (typeof mesh === "string" && mesh !== "" && mesh !== "Attic") {
            toPosition = this.scene.getMeshByName(mesh).getBoundingInfo().boundingBox.centerWorld.add(CameraManager.CATALOG_OFFSET);
            this.distance = this.scene.getMeshByName(mesh).getBoundingInfo().boundingBox.extendSize
                .length() * this.initialValues.distance / 2;
        } else if(mesh === "Attic") {
            toPosition = this.scene.getMeshByName(mesh).getBoundingInfo().boundingBox.centerWorld;
            this.distance = this.initialValues.distance;

        } else {
            toPosition = BABYLON.Vector3.Zero();
            this.distance = this.initialValues.distance;
        }
        if(this.distance > this.initialValues.distance) {
            this.distance = this.initialValues.distance;
        } else if(this.distance < 1) {
            this.distance = 1;
        }
        this.createAnimations(toPosition);
    }

}
