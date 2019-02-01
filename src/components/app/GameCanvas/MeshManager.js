
export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {
        try {
            if (newLambdaMesh !== null && oldLambdaMesh !== null) {
                /**
                 * Remplacement de mesh
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (
                newLambdaMesh !== null &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                /**
                 * Ajout de mesh
                 */
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (newLambdaMesh === null && oldLambdaMesh !== null) {
                /**
                 * Suppression de mesh
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.scene.removeMesh(oldLambdaMesh.mesh);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
