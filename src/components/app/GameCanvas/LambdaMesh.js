export class LambdaMesh {

    constructor(mesh) {
        this.mesh = mesh;
        this.mesh.convertToFlatShadedMesh();
        //this.mesh.freezeWorldMatrix();
        //this.mesh.material.freeze();
        this.mesh.receiveShadows = true;
        this.mesh.receiveShadow = true;
        console.log(this.mesh.name, this.mesh.receiveShadow);
    }

}
