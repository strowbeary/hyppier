import * as BABYLON from "babylonjs";
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
        this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh, true);

        if(newLambdaMesh && oldLambdaMesh) {
            console.log(newLambdaMesh.mesh.name, "replace", oldLambdaMesh.mesh.name);
            this.scene.removeMesh(oldLambdaMesh.mesh);
            this.scene.addMesh(newLambdaMesh.mesh);
        } else {
            console.log(newLambdaMesh.mesh.name, " is new");
            this.scene.addMesh(newLambdaMesh.mesh);
        }
    }
}
