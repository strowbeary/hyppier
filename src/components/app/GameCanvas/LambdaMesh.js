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
        this.mesh.scalingDeterminant = 0;
        this.mesh.freezeWorldMatrix();

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

        switch (direction) {
            case "right":
                this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.x -
                        this.mesh.getBoundingInfo().boundingBox.minimumWorld.x) *
                    (cloneIndex + 1) + 0.1
                ));
                break;
            case "down":
                this.clones[cloneIndex].subtractInPlace(new BABYLON.Vector3(
                    0,
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.y -
                        this.mesh.getBoundingInfo().boundingBox.minimumWorld.y) *
                    (cloneIndex + 1)
                ));
                break;
            case "left":
                this.clones[cloneIndex].position.subtractInPlace(new BABYLON.Vector3(
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.x -
                        this.mesh.getBoundingInfo().boundingBox.minimumWorld.x) *
                    (cloneIndex + 1) + 0.1
                ));
                break;
            default:
                this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                    0,
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximumWorld.y -
                        this.mesh.getBoundingInfo().boundingBox.minimumWorld.y) *
                    (cloneIndex + 1)
                ));
                break;
        }

        this.clones[cloneIndex].scalingDeterminant = 0;
        this.clones[cloneIndex].freezeWorldMatrix();
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
        let animationBox = new BABYLON.Animation(`scaleAppear-${mesh.id}`, "scalingDeterminant", 15, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 15,
            value: 1
        });
        animationBox.setKeys(keys);

        let easingFunction = new BABYLON.ExponentialEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        animationBox.setEasingFunction(easingFunction);
        mesh.animations.push(animationBox);
    }

    getTime() {
        return this.time / GameStore.hype.level;
    }

    launchMaterialDegradation() {

        let time = this.getTime();
        this.unfreezeMaterials(this.mesh);
        this.mesh.animations = [];
        let targets = [this.mesh];
        if(this.multimaterial) {
            targets = this.mesh.material.subMaterials;
        }

        let easingFunction = new BABYLON.ExponentialEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        targets.forEach((material, i) => {
            BABYLON.Animation.CreateAndStartAnimation(
                "materialDegradation",
                this.mesh,
                this.multimaterial ? "material.subMaterials." + i + ".diffuseColor" : "material.diffuseColor",
                30,
                time,
                material.ambientColor,
                BABYLON.Color3.White(),
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                easingFunction);
            BABYLON.Animation.CreateAndStartAnimation(
                "materialDegradation",
                this.mesh,
                this.multimaterial ? "material.subMaterials." + i + ".ambientColor" : "material.ambientColor",
                30,
                time,
                material.ambientColor,
                new BABYLON.Color3(0.8,0.8,0.8),
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                easingFunction, () => {
                    this.freezeMaterials(this.mesh)
                });
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
                clone._scene.beginAnimation(clone, 0, 15, false, 1, () => {
                    clone.freezeWorldMatrix()
                });
            });
        }

        this.mesh._scene.beginAnimation(this.mesh, 0, 15, false, 1, () => {
            this.mesh.freezeWorldMatrix();
            typeof callback === 'function' && callback()
        });
    }

    launchCloneDisappearAnimation(callback) {
        const lastClone = this.clones[this.clones.length - 1];
        lastClone.unfreezeWorldMatrix();
        this.scaleAppearAnimation(lastClone);
        lastClone._scene.beginAnimation(lastClone, 15, 0, false, 1, () => {
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
                clone._scene.beginAnimation(clone, 15, 0, false, 1, () => {
                    clone.scalingDeterminant = 0;
                    clone.freezeWorldMatrix();
                });
            });
        }
        this.mesh._scene.beginAnimation(this.mesh, 15, 0, false, 1, () => {
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
