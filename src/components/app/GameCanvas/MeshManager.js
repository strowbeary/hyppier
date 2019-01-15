
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
        console.log(newLambdaMesh, oldLambdaMesh);
            if(newLambdaMesh && oldLambdaMesh) {
                /**
                 * Replace object
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
            } else if (
                newLambdaMesh !== null &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (newLambdaMesh === null && oldLambdaMesh !== null) {
                this.scene.removeMesh(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
            }

    }
}
