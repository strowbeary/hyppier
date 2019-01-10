import * as BABYLON from "babylonjs";
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(lambdaMeshes) {
        lambdaMeshes.forEach(lambdaMesh => {
            if (typeof lambdaMesh.mesh.material.subMaterials !== "undefined") {
                lambdaMesh.mesh.material.subMaterials.forEach(material => {
                    material.diffuseColor = new BABYLON.Color3(1,1,1);
                });
            } else {
                lambdaMesh.mesh.material.diffuseColor = new BABYLON.Color3(1,1,1);
            }
            lambdaMesh.mesh.receiveShadows= true;
            this.lights.shadowGenerator.addShadowCaster(lambdaMesh.mesh, true);
            this.scene.addMesh(lambdaMesh.mesh);
        })
    }
}
