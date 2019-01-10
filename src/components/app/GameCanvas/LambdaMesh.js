export class LambdaMesh {

    constructor(mesh) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        //this.mesh.freezeWorldMatrix();
        //this.mesh.material.freeze();
        if(mesh.name.includes("Table")) {
            this.mesh.receiveShadows = true;
        }
    }

}
