
export class MeshManager {
    constructor(scene, lights, gameManager) {
        this.scene = scene;
        this.lights = lights;
        this.gameManager = gameManager;
    }
    patch(newLambdaMesh, oldLambdaMesh, timer) {
        try {
            if (newLambdaMesh !== null && oldLambdaMesh !== null
                && this.scene.meshes.indexOf(newLambdaMesh.mesh) === -1 && newLambdaMesh.mesh.name !== oldLambdaMesh.mesh.name) {
                /**
                 * Remplacement de mesh
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                newLambdaMesh.clones.forEach((clone) => {
                    this.scene.addMesh(clone);
                });
                oldLambdaMesh.launchDisappearAnimation(() => {
                    setTimeout(() => {
                        oldLambdaMesh.clones.forEach(clone => {
                            this.scene.removeMesh(clone);
                        });
                        this.scene.removeMesh(oldLambdaMesh.mesh);
                        newLambdaMesh.launchAppearAnimation(() => this.gameManager.playAfterCatalog(timer, oldLambdaMesh.objectKindName));
                    }, 0)
                });
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (
                newLambdaMesh !== null &&
                oldLambdaMesh === null &&
                this.scene.meshes.indexOf(newLambdaMesh.mesh) === -1
            ) {
                /**
                 * Ajout de mesh
                 */
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
                newLambdaMesh.launchAppearAnimation();
            } else if (newLambdaMesh === null && oldLambdaMesh !== null) {
                /**
                 * Suppression de mesh
                 */
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                oldLambdaMesh.launchDisappearAnimation(() => {this.scene.removeMesh(oldLambdaMesh.mesh); this.gameManager.playAfterCatalog(timer, oldLambdaMesh.objectKindName)});
            } else if (oldLambdaMesh !== null) {
                this.gameManager.playAfterCatalog(timer, oldLambdaMesh.objectKindName);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
