
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
            if(newLambdaMesh && oldLambdaMesh) {
                /**
                 * Replace object
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                console.log(newLambdaMesh.mesh.name, "replace", oldLambdaMesh.mesh.name);
                this.scene.addMesh(newLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
            } else if (
                /**
                 * Add new object
                 */
                newLambdaMesh &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                console.log(newLambdaMesh.mesh.name, " is new");
                this.scene.addMesh(newLambdaMesh.mesh);
            } else {
                /**
                 * Update object
                 */
                console.log(newLambdaMesh.mesh.name, " is updated");
            }
            console.log(newLambdaMesh.mesh.position);

    }
}
