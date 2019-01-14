export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
        if(newLambdaMesh && oldLambdaMesh) {
            this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
            this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
            console.log(newLambdaMesh.mesh.name, "replace", oldLambdaMesh.mesh.name);
            this.scene.removeMesh(oldLambdaMesh.mesh);
            this.scene.addMesh(newLambdaMesh.mesh);
        } else {
            this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
            console.log(newLambdaMesh.mesh.name, " is new");
            this.scene.addMesh(newLambdaMesh.mesh);
        }
    }
}
