
export class MeshManager {
    constructor(scene, lights, gameManager) {
        this.scene = scene;
        this.lights = lights;
        this.gameManager = gameManager;
    }
    patch(newLambdaMesh, oldLambdaMesh, timer) {

        try {
            if (newLambdaMesh !== null && oldLambdaMesh !== null
                && this.scene.getMeshByName(newLambdaMesh.mesh.name) === null) {
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                if (oldLambdaMesh.clone) {
                    oldLambdaMesh.launchDisappearAnimation(() => {this.scene.removeMesh(oldLambdaMesh.clone)});
                }
                oldLambdaMesh.launchDisappearAnimation(() => {
                    setTimeout(() => {
                        this.scene.removeMesh(oldLambdaMesh.mesh);
                        newLambdaMesh.launchAppearAnimation(() => this.gameManager.playAfterCatalog(timer));
                    }, 0)
                });
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (
                newLambdaMesh !== null &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
                newLambdaMesh.launchAppearAnimation();
            } else if (newLambdaMesh === null && oldLambdaMesh !== null) {
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                oldLambdaMesh.launchDisappearAnimation(() => {this.scene.removeMesh(oldLambdaMesh.mesh); this.gameManager.playAfterCatalog(timer)});
            }
        } catch (e) {
            console.error(e);
        }
    }
}
