import * as BABYLON from "babylonjs";
import * as cannon from "cannon";
import GameStore from "../../../stores/GameStore/GameStore";

export class AtticManager {
    constructor(scene, particleSystem) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        this.mesh.setEnabled(false);
        this.particleSystem = particleSystem;
    }

    prepareGravity() {
        this.attic = this.scene.getMeshByName("Grenier");
        this.scene.enablePhysics(null);
        this.groundPosition = new BABYLON.Vector3(
            0,
            this.attic.position.y - this.attic.getBoundingInfo().boundingBox.maximum.y * this.attic.scaling.y,
            0
        );
        this.ground = BABYLON.Mesh.CreateGround("ground", 32, 32, 2, this.scene);
        this.ground.position = this.groundPosition;
        this.ground.isVisible = false;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.5 }, this.scene);
    }

    createParcel(mesh, objectKindType) {
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
        GameStore.attic.incrementParcelsNumberOf(objectKindType);
        this.scene.addMesh(instance);
        this.particleSystem.start();
    }

    fall() {
        this.ground.position = new BABYLON.Vector3(
            0,
            -this.attic.getBoundingInfo().boundingBox.maximum.y * this.attic.scaling.y,
            0
        );
    }
}