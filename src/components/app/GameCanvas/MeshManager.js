import {NotificationsManager} from "../../../stores/NotificationsManager";
import {showAxis} from "../3dScene/utils/Axis";

export class MeshManager {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
    }
    patch(newLambdaMesh, oldLambdaMesh) {

        try {
            if(newLambdaMesh && oldLambdaMesh) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                this.lights.shadowGenerator.removeShadowCaster(oldLambdaMesh.mesh);
                console.log(newLambdaMesh.mesh.name, "replace", oldLambdaMesh.mesh.name);
                this.scene.removeMesh(oldLambdaMesh.mesh);
                this.scene.addMesh(newLambdaMesh.mesh);
            } else if (
                newLambdaMesh &&
                oldLambdaMesh === null &&
                this.scene.getMeshByName(newLambdaMesh.mesh.name) === null
            ) {
                this.lights.shadowGenerator.addShadowCaster(newLambdaMesh.mesh);
                console.log(newLambdaMesh.mesh.name, " is new");
                this.scene.addMesh(newLambdaMesh.mesh);
                NotificationsManager.createFromMesh(newLambdaMesh);
            } else {
                console.log(newLambdaMesh.mesh.name, " is updated");
                newLambdaMesh.notification.update2dPosition(this.scene);
                newLambdaMesh.notification.setPosition(newLambdaMesh.mesh.position);
                newLambdaMesh.notification.update2dPosition(this.scene);
            }
        } catch (e) {
            console.error(e)
        }

    }
}
