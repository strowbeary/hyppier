import * as BABYLON from "babylonjs";
import * as cannon from "cannon";
import GameStore from "../../../stores/GameStore/GameStore";
import {showAxis} from "../utils/Axis";
import {onPatch} from "mobx-state-tree";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

export class AtticManager {
    constructor(scene, particleSystem) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        this.mesh.material = this.scene.getMaterialByName("Clay");
        this.mesh.setEnabled(false);
        this.particleSystem = particleSystem;

        onPatch(TutoStore, (patch) => {
            if (patch.path.includes("currentMessage") && patch.value === 4) {
                this.launchLadderFall();
            }
        });
    }

    launchLadderFall() {
        this.ladder.unfreezeWorldMatrix();
        BABYLON.Animation.CreateAndStartAnimation('ladderFall', this.ladder, 'position.y', 30, 30, 10, this.originalPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    prepareGravity() {
        this.attic = this.scene.getMeshByName("Attic");
        this.groundPosition = new BABYLON.Vector3(
            0,
            this.attic.position.y - this.attic.getBoundingInfo().boundingBox.maximum.y * this.attic.scaling.y,
            0
        );
        this.ground = BABYLON.Mesh.CreateGround("ground", 32, 32, 2, this.scene);


        this.wall1 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall1.position = new BABYLON.Vector3(
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.maximumWorld.x,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.maximumWorld.z
        );
        this.wall1.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall1.isVisible = false;
        this.wall1.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall1, BABYLON.PhysicsImpostor.PlaneImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.wall2 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall2.position = new BABYLON.Vector3(
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.x,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.maximumWorld.z
        );
        this.wall2.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall2.isVisible = false;
        this.wall2.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall2, BABYLON.PhysicsImpostor.PlaneImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.wall3 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall3.position = new BABYLON.Vector3(
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.x,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.maximumWorld.z
        );
        this.wall3.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall3.isVisible = false;
        this.wall3.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall3, BABYLON.PhysicsImpostor.PlaneImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);

        this.wall4 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall4.position = new BABYLON.Vector3(
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.x,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.z
        );
        this.wall4.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall4.isVisible = false;
        this.wall4.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall4, BABYLON.PhysicsImpostor.PlaneImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.ground.position = this.groundPosition;
        this.ground.isVisible = false;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.PlaneImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);
    }

    prepareLadder() {
        this.ladder = this.scene.getMeshByName("Ladder.001");
        this.ladder.unfreezeWorldMatrix();
        this.originalPosition = this.ladder.position.y;
        this.ladder.position.y = 10;
        this.ladder.freezeWorldMatrix();
        this.setClickEvent();
    }

    setClickEvent() {
        this.ladder.isPickable = true;
        this.ladder.actionManager = new BABYLON.ActionManager(this.scene);
        this.ladder.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => { //DO SOMETHING ON CLICK
                    if (!CatalogStore.isOpen) {
                        if (CameraStore.meshName !== "Attic") {
                            CameraStore.setTarget("Attic");
                        } else {
                            CameraStore.setTarget("");
                        }
                    }
                }
            )
        );
    }

    createParcel(mesh, objectKindType) {
        let instance = this.mesh.createInstance(mesh.name);
        instance.scaling = new BABYLON.Vector3(
            Math.abs(mesh.getBoundingInfo().boundingBox.maximumWorld.x),
            Math.abs(mesh.getBoundingInfo().boundingBox.maximumWorld.y),
            Math.abs(mesh.getBoundingInfo().boundingBox.maximumWorld.z)
        );
        instance.position = new BABYLON.Vector3(
            mesh.position.x,
            this.groundPosition.y + ((mesh.getBoundingInfo().boundingBox.maximum.y * mesh.scaling.y) / 2),
            mesh.position.z
        );
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 1,
            restitution: 0.5
        }, this.scene);
        GameStore.attic.incrementParcelsNumberOf(objectKindType);
        this.scene.addMesh(instance);
        this.particleSystem.start();
    }

    fall() {
        this.ground.position = new BABYLON.Vector3(
            0,
            this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y,
            0
        );
    }
}
