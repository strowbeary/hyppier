
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
        try {
            if (newLambdaMesh !== null && oldLambdaMesh !== null
                && this.scene.getMeshByName(newLambdaMesh.mesh.name) === null) {
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (
                newLambdaMesh !== null &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (newLambdaMesh === null && oldLambdaMesh !== null) {
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
