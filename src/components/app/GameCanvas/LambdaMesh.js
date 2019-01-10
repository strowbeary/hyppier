import * as BABYLON from "babylonjs";

export class LambdaMesh {

    constructor(mesh) {
        this.mesh = mesh;

        if (typeof this.mesh.material.subMaterials !== "undefined") {
            this.mesh.material.subMaterials.forEach(material => {
                material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            });
        } else {
            this.mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        }
        this.mesh.convertToFlatShadedMesh();
        this.mesh.freezeWorldMatrix();
        //this.mesh.material.freeze();
        this.mesh.receiveShadows = true;
    }


}
