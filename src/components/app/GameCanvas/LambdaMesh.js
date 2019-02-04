import * as BABYLON from "babylonjs";
import GameStore from "../../../stores/GameStore/GameStore";

export class LambdaMesh {
    constructor(mesh, objectTimeout, objectKindName) {
        this.objectKindName = objectKindName;
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.receiveShadows = false;
        this.mesh.setEnabled(false);
        this.clone = [];
        if (this.mesh) {
            this.multimaterial = this.mesh.material.subMaterials !== undefined;
            this.time = objectTimeout * 0.03;
            this.cloneMaterial(this.mesh);
            this.freezeMaterials(this.mesh);
            /*if (this.mesh._scene) {
                this.setClickEvent();
            }*/
        }
    }

    addClone() {
        let cloneIndex = this.clone.length;
        this.clone.push(this.mesh.clone("clone"));
        this.clone[cloneIndex].setEnabled(false);
        this.clone[cloneIndex].position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y + (this.mesh.getBoundingInfo().maximum.y * this.mesh.scaling.y) * (cloneIndex + 1), this.mesh.position.z);
        this.cloneMaterial(this.clone[cloneIndex]);
        this.freezeMaterials(this.clone[cloneIndex]);
    }

    cloneMaterial(mesh) {// Need to clone material before animation
        if (this.multimaterial) {
            for (let i = 0; i < mesh.material.subMaterials.length; i++) {
                mesh.material.subMaterials[i] = mesh.material.subMaterials[i].clone();
            }
        } else {
            mesh.material = mesh.material.clone();
        }
    }

    scaleAppearAnimation(mesh) {
        mesh.animations = [];
        let animationBox = new BABYLON.Animation(`scaleAppear-${mesh.id}`, "scalingDeterminant", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 15,
            value: 1.15
        });
        keys.push({
            frame: 30,
            value: 1
        });
        animationBox.setKeys(keys);

        let easingFunction = new BABYLON.ExponentialEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animationBox.setEasingFunction(easingFunction);
        mesh.animations.push(animationBox);
    }

    materialDegradation(frameNumber, mesh) {
        mesh.animations = [];
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                let animationBox = new BABYLON.Animation(`materialDegradation-${mesh.id}-${i}`, "material.subMaterials." + i + ".diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                let keys = [];
                keys.push({
                    frame: 0,
                    value: mesh.material.subMaterials[i].diffuseColor
                });
                keys.push({
                    frame: frameNumber,
                    value: new BABYLON.Color3.Black()
                });
                animationBox.setKeys(keys);

                let easingFunction = new BABYLON.ExponentialEase();
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
                animationBox.setEasingFunction(easingFunction);
                mesh.animations.push(animationBox);
            }
        } else {
            let animationBox = new BABYLON.Animation(`materialDegradation-${mesh.id}`, "material.diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            let keys = [];
            keys.push({
                frame: 0,
                value: mesh.material.diffuseColor
            });
            keys.push({
                frame: frameNumber,
                value: new BABYLON.Color3.Black()
            });
            animationBox.setKeys(keys);

            let easingFunction = new BABYLON.ExponentialEase();
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            animationBox.setEasingFunction(easingFunction);
            mesh.animations.push(animationBox);
        }
    }

    getTime() {
        return this.time / GameStore.hype.level;
    }

    launchMaterialDegradation() {
        let time = this.getTime();
        this.unfreezeMaterials(this.mesh);
        this.materialDegradation(time, this.mesh);
        if (this.clone.length > 0) {
            this.clone.forEach(clone => {
                this.unfreezeMaterials(clone);
                this.materialDegradation(time, clone);
                clone._scene.beginAnimation(clone, 0, time, false, 1, () => {
                    this.freezeMaterials(clone)
                });
            })
        }
        this.mesh._scene.beginAnimation(this.mesh, 0, time, false, 1, () => {
            this.freezeMaterials(this.mesh)
        });
    }

    launchAppearAnimation(callback) {
        this.mesh.unfreezeWorldMatrix();
        this.mesh.setEnabled(true);
        this.scaleAppearAnimation(this.mesh);
        if (this.clone.length > 0) {
            this.clone.forEach(clone => {
                clone.setEnabled(true);
                clone.unfreezeWorldMatrix();
                this.scaleAppearAnimation(clone);
                clone._scene.beginAnimation(clone, 0, 30, false, 1, () => {
                    clone.freezeWorldMatrix()
                });
            });
        }
        this.mesh._scene.beginAnimation(this.mesh, 0, 30, false, 1, () => {
            this.mesh.freezeWorldMatrix();
            typeof callback === 'function' && callback()
        });
    }

    launchDisappearAnimation(callback) {
        this.mesh.unfreezeWorldMatrix();
        this.scaleAppearAnimation(this.mesh);
        this.mesh._scene.beginAnimation(this.mesh, 30, 0, false, 1, () => {
            this.mesh.scalingDeterminant = 0;
            this.mesh.freezeWorldMatrix();
            typeof callback === 'function' && callback()
        });
    }

    setClickEvent() {
        //Get Click Event on object
        this.mesh.isPickable = true;
        this.mesh.actionManager = new BABYLON.ActionManager(this.mesh._scene);
        this.mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => { //DO SOMETHING ON CLICK
                    this.launchDisappearAnimation();
                }
            )
        );
    }

    freezeMaterials(mesh) {
        if (this.multimaterial) {
            for (let i = 0; i < mesh.material.subMaterials.length; i++) {
                mesh.material.subMaterials[i].freeze();
            }
        } else {
            mesh.material.freeze();
        }
    }

    unfreezeMaterials(mesh) {
        if (this.multimaterial) {
            for (let i = 0; i < mesh.material.subMaterials.length; i++) {
                mesh.material.subMaterials[i].unfreeze();
            }
        } else {
            mesh.material.unfreeze();
        }
    }
}