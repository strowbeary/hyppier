
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
                if (oldLambdaMesh.clone) {
                    oldLambdaMesh.launchDisappearAnimation(() => {this.scene.removeMesh(oldLambdaMesh.clone)});
                }
                oldLambdaMesh.launchDisappearAnimation(() => {
                    setTimeout(() => {
                        this.scene.removeMesh(oldLambdaMesh.mesh);
                        newLambdaMesh.launchAppearAnimation();
                    }, 500)
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
                oldLambdaMesh.launchDisappearAnimation(() => {this.scene.removeMesh(oldLambdaMesh.mesh)});
            }
        } catch (e) {
            console.error(e);
        }
    }
}
