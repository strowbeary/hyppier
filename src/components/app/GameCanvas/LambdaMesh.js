import * as BABYLON from "babylonjs";
import GameStore from "../../../stores/GameStore/GameStore";

export class LambdaMesh {

    constructor(mesh, objectTimeout, objectKindName) {
        this.objectKindName = objectKindName;
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.convertToUnIndexedMesh();
        this.mesh.receiveShadows = false;
        this.mesh.setEnabled(false);

        const pivotPosition = this.mesh.getBoundingInfo().boundingBox.centerWorld;

        if (this.objectKindName === "Transport") {
            this.mesh.setPivotPoint(new BABYLON.Vector3(
                pivotPosition.x - this.mesh.position.x,
                pivotPosition.y - this.mesh.position.y,
                pivotPosition.z - this.mesh.position.z
            ));
        }

        this.clones = [];
        if (this.mesh) {
            this.multimaterial = this.mesh.material.subMaterials !== undefined;
            this.time = objectTimeout * 0.03;
            this.cloneMaterial(this.mesh);
            this.freezeMaterials(this.mesh);
        }
    }

    addClone(direction) {
        let cloneIndex = this.clones.length;
        let clone = this.mesh.createInstance(this.mesh.name);
        this.clones.push(clone);
        this.clones[cloneIndex].setEnabled(false);
        if (direction === "up") {
            this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                    0,
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.y -
                        this.mesh.getBoundingInfo().boundingBox.minimumWorld.y) *
                    (cloneIndex + 1),
                    0
                ));
        } else if (direction === "left") {
            this.clones[cloneIndex].position.subtractInPlace(new BABYLON.Vector3(
                Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.x -
                    this.mesh.getBoundingInfo().boundingBox.minimumWorld.x) *
                (cloneIndex + 1) + 0.1,
                0,
                0
            ));
        } else if (direction === "down") {
            this.clones[cloneIndex].subtractInPlace(new BABYLON.Vector3(
                0,
                Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.y -
                    this.mesh.getBoundingInfo().boundingBox.minimumWorld.y) *
                (cloneIndex + 1),
                0
            ));
        } else if (direction === "right") {
            this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.x -
                    this.mesh.getBoundingInfo().boundingBox.minimumWorld.x) *
                (cloneIndex + 1) + 0.1,
                0,
                0
            ));
        }
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
                    value: new BABYLON.Color3.White()
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
                value: new BABYLON.Color3.White()
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
        this.mesh._scene.beginAnimation(this.mesh, 0, time, false, 1, () => {
            this.freezeMaterials(this.mesh)
        });
    }

    launchAppearAnimation(callback) {
        this.mesh.unfreezeWorldMatrix();
        this.mesh.scalingDeterminant = 0;
        this.mesh.setEnabled(true);


        this.scaleAppearAnimation(this.mesh);
        if (this.clones.length > 0) {
            this.clones.forEach(clone => {
                if (this.mesh._scene.meshes.indexOf(clone) === -1) {
                    this.mesh._scene.addMesh(clone);
                }
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

    launchCloneDisappearAnimation(callback) {
        const lastClone = this.clones[this.clones.length - 1];
        lastClone.unfreezeWorldMatrix();
        this.scaleAppearAnimation(lastClone);
        lastClone._scene.beginAnimation(lastClone, 30, 0, false, 1, () => {
            lastClone.scalingDeterminant = 0;
            lastClone.freezeWorldMatrix();
            typeof callback === 'function' && callback()
        });
    }

    launchDisappearAnimation(callback) {
        this.mesh.unfreezeWorldMatrix();
        this.scaleAppearAnimation(this.mesh);
        if (this.clones.length > 0) {
            this.clones.forEach(clone => {
                clone.unfreezeWorldMatrix();
                this.scaleAppearAnimation(clone);
                clone._scene.beginAnimation(clone, 30, 0, false, 1, () => {
                    clone.scalingDeterminant = 0;
                    clone.freezeWorldMatrix();
                });
            });
        }
        this.mesh._scene.beginAnimation(this.mesh, 30, 0, false, 1, () => {
            this.mesh.scalingDeterminant = 0;
            this.mesh.freezeWorldMatrix();
            typeof callback === 'function' && callback()
        });
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
