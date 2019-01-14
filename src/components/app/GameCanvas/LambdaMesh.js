export class LambdaMesh {
    notification;
    constructor(mesh) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.receiveShadows = true;
        this.mesh.receiveShadow = true;
    }

    bindNotification(notification) {
        this.notification = notification;
    }
}
