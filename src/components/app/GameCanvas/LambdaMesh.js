import * as BABYLON from "babylonjs";

export class LambdaMesh {
    constructor(mesh) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.receiveShadows = false;
        if (this.mesh) {
            this.multimaterial = this.mesh.material.subMaterials !== undefined;
            this.time = 1000;
            this.cloneMaterial();
            this.freezeMaterials();
            /*if (this.mesh._scene) {
                this.setClickEvent();
            }*/
        }
    }

    addClone() {
        this.clone = this.mesh.clone("clone");
        this.clone.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y + this.mesh.getBoundingInfo().maximum.y * this.mesh.scaling.y, this.mesh.position.z);
    }

    cloneMaterial() {// Need to clone material before animation
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                this.mesh.material.subMaterials[i] = this.mesh.material.subMaterials[i].clone();
                if (this.clone) {
                    this.clone.material.subMaterials[i] = this.mesh.material.subMaterials[i].clone();
                }
            }
        } else {
            this.mesh.material = this.mesh.material.clone();
            if (this.clone) {
                this.clone.material = this.clone.material.clone();
            }
        }
    }

    scaleAppearAnimation() {
        this.mesh.animations = [];
        let animationBox = new BABYLON.Animation(`scaleAppear-${this.mesh.id}`, "scalingDeterminant", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 30,
            value: 1.15
        });
        keys.push({
            frame: 45,
            value: 1
        });
        animationBox.setKeys(keys);

        let easingFunction = new BABYLON.ExponentialEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animationBox.setEasingFunction(easingFunction);
        this.mesh.animations.push(animationBox);
    }

    materialDegradation(frameNumber) {
        this.mesh.animations = [];
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                let animationBox = new BABYLON.Animation(`materialDegradation-${this.mesh.id}-${i}`, "material.subMaterials."+i+".diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                let keys = [];
                keys.push({
                    frame: 0,
                    value: this.mesh.material.subMaterials[i].diffuseColor
                });
                keys.push({
                    frame: frameNumber,
                    value: new BABYLON.Color3.White()
                });
                animationBox.setKeys(keys);

                let easingFunction = new BABYLON.ExponentialEase();
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
                animationBox.setEasingFunction(easingFunction);
                this.mesh.animations.push(animationBox);
            }
        } else {
            let animationBox = new BABYLON.Animation(`materialDegradation-${this.mesh.id}`, "material.diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            let keys = [];
            keys.push({
                frame: 0,
                value: this.mesh.material.diffuseColor
            });
            keys.push({
                frame: frameNumber,
                value: new BABYLON.Color3.White()
            });
            animationBox.setKeys(keys);

            let easingFunction = new BABYLON.ExponentialEase();
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            animationBox.setEasingFunction(easingFunction);
            this.mesh.animations.push(animationBox);
        }
    }

    launchMaterialDegradation() {
        this.unfreezeMaterials();
        this.materialDegradation(this.time);
        this.mesh._scene.beginAnimation(this.mesh, 0, this.time, false, 1, this.freezeMaterials.bind(this));
    }

    launchAppearAnimation() {
        this.mesh.unfreezeWorldMatrix();
        this.scaleAppearAnimation();
        this.mesh._scene.beginAnimation(this.mesh, 0, 45, false, 1, () => {this.mesh.freezeWorldMatrix()});
    }

    launchDisappearAnimation() {
        this.mesh.unfreezeWorldMatrix();
        this.scaleAppearAnimation();
        this.mesh._scene.beginAnimation(this.mesh, 45, 0, false, 1, () => {this.mesh.scalingDeterminant = 0; this.mesh.freezeWorldMatrix()});
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

    freezeMaterials() {
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                this.mesh.material.subMaterials[i].freeze();
            }
        } else {
            this.mesh.material.freeze();
        }
    }

    unfreezeMaterials() {
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                this.mesh.material.subMaterials[i].unfreeze();
            }
        } else {
            this.mesh.material.unfreeze();
        }
    }
}