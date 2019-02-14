import * as BABYLON from "babylonjs";

function desaturate(color3 = BABYLON.Color3.White(), k) {
    let intensity = 0.3 * color3.r + 0.59 * color3.g + 0.11 * color3.b;
    return new BABYLON.Color3(
        intensity * k + color3.r * (1 - k),
        intensity * k + color3.g * (1 - k),
        intensity * k + color3.b * (1 - k)
    );
}
function saturate(color3 = BABYLON.Color3.White(), k) {
    let intensity = 0.3 * color3.r + 0.59 * color3.g + 0.11 * color3.b;
    return new BABYLON.Color3(
        -intensity * k + color3.r * (1 + k),
        -intensity * k + color3.g * (1 + k),
        -intensity * k + color3.b * (1 + k)
    );
}
function lighten(color3 = BABYLON.Color3.White(), k) {
    let result = BABYLON.Color3.White().clone();
    color3
        .add(new BABYLON.Color3(k, k, k))
        .clampToRef(0, 0.8, result);
    return result;

}

export class LambdaMesh {

    constructor(mesh, objectTimeout, objectKindName) {
        this.objectKindName = objectKindName;
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.convertToUnIndexedMesh();
        this.mesh.receiveShadows = false;
        this.mesh.setEnabled(false);
        this.mesh.freezeWorldMatrix();

        if (this.objectKindName === "Transport") {
            this.mesh.setPivotPoint(
                this.mesh.getBoundingInfo().boundingBox.centerWorld
                    .subtract(this.mesh.position)
            );
        }
        this.mesh.scalingDeterminant = 0;

        this.clones = [];

        if (this.mesh) {
            this.multimaterial = this.mesh.material.subMaterials !== undefined;
            this.cloneMaterial(this.mesh);
            this.freezeMaterials(this.mesh);
        }

        if(this.multimaterial) {
            mesh.material.subMaterials
                .forEach(material => {
                    material.ambientColor = lighten(material.ambientColor, 0.20);
                   // material.diffuseColor = saturate(material.diffuseColor, 1);
                });
        } else {
            mesh.material.ambientColor = lighten(mesh.material.ambientColor, 0.20);
           // mesh.material.diffuseColor  = saturate(mesh.material.diffuseColor, 1);
        }

    }

    enableCollision() {
        this.clones.forEach(clone => {
        clone.physicsImpostor = new BABYLON.PhysicsImpostor(clone, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0
            }, this.mesh._scene);
        });
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0
        }, this.mesh._scene);
    }

    addClone(direction) {
        let cloneIndex = this.clones.length;
        let clone = this.mesh.createInstance(this.mesh.name);
        this.clones.push(clone);
        this.clones[cloneIndex].setEnabled(false);

        switch (direction) {
            case "right":
                this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximum.x -
                        this.mesh.getBoundingInfo().boundingBox.minimum.x) *
                    (cloneIndex + 1) + 0.1
                ));
                break;
            case "down":
                this.clones[cloneIndex].subtractInPlace(new BABYLON.Vector3(
                    0,
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximum.y -
                        this.mesh.getBoundingInfo().boundingBox.minimum.y) *
                    (cloneIndex + 1)
                ));
                break;
            case "left":
                this.clones[cloneIndex].position.subtractInPlace(new BABYLON.Vector3(
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximum.x -
                        this.mesh.getBoundingInfo().boundingBox.minimum.x) *
                    (cloneIndex + 1) + 0.1
                ));
                break;
            default:
                this.clones[cloneIndex].position.addInPlace(new BABYLON.Vector3(
                    0,
                    Math.abs(this.mesh.getBoundingInfo().boundingBox.maximum.y -
                        this.mesh.getBoundingInfo().boundingBox.minimum.y) *
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
        let animationBox = new BABYLON.Animation(`scaleAppear-${mesh.id}`, "scalingDeterminant", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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

    launchMaterialDegradation(duration) {
        let time = duration * 0.03; //get frames number
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
                "materialDegradation-diffuse-" + material.name,
                this.mesh,
                this.multimaterial ? "material.subMaterials." + i + ".diffuseColor" : "material.diffuseColor",
                30,
                time,
                material.diffuseColor,
                new BABYLON.Color3(0.8, 0.8, 0.8),
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                null);

            BABYLON.Animation.CreateAndStartAnimation(
                "materialDegradation-ambient-" + material.name,
                this.mesh,
                this.multimaterial ? "material.subMaterials." + i + ".ambientColor" : "material.ambientColor",
                30,
                time,
                material.ambientColor,
                new BABYLON.Color3(0.8,0.8,0.8),
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                null, () => {
                    this.freezeMaterials(this.mesh);
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
