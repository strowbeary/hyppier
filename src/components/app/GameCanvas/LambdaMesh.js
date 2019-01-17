export class LambdaMesh {
    constructor(mesh) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        this.mesh.receiveShadows = false;
    }
}
