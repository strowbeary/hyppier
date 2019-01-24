import * as BABYLON from "babylonjs";
import * as cannon from "cannon";

export class AtticManager {
    constructor(scene) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        this.mesh.setEnabled(false);
    }

    prepareGravity() {
        this.attic = this.scene.getMeshByName("Grenier");
        this.scene.enablePhysics(null);
        this.groundPosition = new BABYLON.Vector3(
            0,
            this.attic.position.y - this.attic.getBoundingInfo().boundingBox.maximum.y * this.attic.scaling.y,
            0
        );
        let ground = BABYLON.Mesh.CreateGround("ground", 32, 32, 2, this.scene);
        ground.position = this.groundPosition;
        ground.isVisible = false;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.5 }, this.scene);
    }

    createCarton(mesh) {
        let instance = this.mesh.createInstance(mesh.name);
        instance.scaling = new BABYLON.Vector3(
            mesh.getBoundingInfo().boundingBox.maximum.x,
            mesh.getBoundingInfo().boundingBox.maximum.y,
            mesh.getBoundingInfo().boundingBox.maximum.z
        );
        instance.position = new BABYLON.Vector3(
            mesh.position.x,
            this.groundPosition.y + ((mesh.getBoundingInfo().boundingBox.maximum.y * mesh.scaling.y)/2),
            mesh.position.z
        );
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.5 }, this.scene);
        this.scene.addMesh(instance);
    }
}