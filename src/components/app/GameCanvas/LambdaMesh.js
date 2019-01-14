export class LambdaMesh {
    notification;
    constructor(mesh, objectStore) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.receiveShadows = true;
        this.mesh.receiveShadow = true;
        this.objectStore = objectStore;
    }

    bindNotification(notification) {
        this.notification = notification;
    }
}
