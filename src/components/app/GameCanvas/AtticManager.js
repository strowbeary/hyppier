import * as BABYLON from "babylonjs";
import * as cannon from "cannon";
import GameStore from "../../../stores/GameStore/GameStore";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {GameManagerInstance} from "../../../GameManager";

export class AtticManager {
    constructor(scene, particleSystem, soundManager) {
        this.scene = scene;
        this.particleSystem = particleSystem;
        this.soundManager = soundManager;
    }

    launchLadderFall() {
        let spriteManagerDust = new BABYLON.SpriteManager("treesManager", "/img/Pipo-Idle.png", 1, 256, this.scene);
        spriteManagerDust.renderingGroupId = 1;
        let dust = new BABYLON.Sprite("dust", spriteManagerDust);
        dust.position = new BABYLON.Vector3(this.ladder.position.x, this.originalPosition, this.ladder.position.z);
        dust.playAnimation(0, 100, false, 5);
        dust.disposeWhenFinishedAnimating = true;
        this.ladder.unfreezeWorldMatrix();
        BABYLON.Animation.CreateAndStartAnimation('ladderFall', this.ladder, 'position.y', 30, 30, 10, this.originalPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        this.soundManager.ladderDrop.play();
    }

    prepareGravity() {
        this.attic = this.scene.getMeshByName("Attic");
        this.groundPosition = new BABYLON.Vector3(
            0,
            this.attic.getBoundingInfo().boundingBox.minimumWorld.y,
            0
        );
        this.ground = BABYLON.Mesh.CreateGround("ground", 32, 32, 2, this.scene);

        const roomBoundingBox = this.scene.getMeshByName("Room").getBoundingInfo().boundingBox;

        this.wall1 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall1.position = new BABYLON.Vector3(
            roomBoundingBox.maximumWorld.x,
            roomBoundingBox.minimumWorld.y,
            roomBoundingBox.maximumWorld.z
        );
        this.wall1.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall1.isVisible = false;
        this.wall1.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall1, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.wall2 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall2.position = new BABYLON.Vector3(
            roomBoundingBox.minimumWorld.x,
            roomBoundingBox.minimumWorld.y,
            roomBoundingBox.maximumWorld.z
        );
        this.wall2.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall2.isVisible = false;
        this.wall2.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall2, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.wall3 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall3.position = new BABYLON.Vector3(
            roomBoundingBox.minimumWorld.x,
            roomBoundingBox.minimumWorld.y,
            roomBoundingBox.maximumWorld.z
        );
        this.wall3.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall3.isVisible = false;
        this.wall3.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall3, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);

        this.wall4 = BABYLON.Mesh.CreatePlane("ground", 32, this.scene);
        this.wall4.position = new BABYLON.Vector3(
            roomBoundingBox.minimumWorld.x,
            roomBoundingBox.minimumWorld.y,
            roomBoundingBox.minimumWorld.z
        );
        this.wall4.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.LOCAL);
        this.wall4.isVisible = false;
        this.wall4.physicsImpostor = new BABYLON.PhysicsImpostor(this.wall4, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);


        this.ground.position = this.groundPosition;
        this.ground.isVisible = false;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.5
        }, this.scene);
    }

    prepareLadder() {
        this.ladder = this.scene.getMeshByName("Ladder");
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
                        TutoStore.reportAction("Attic", "actioned");
                        if (CameraStore.meshName !== "Attic") {
                            CameraStore.setTarget("Attic");
                            GameManagerInstance.pauseGame();
                            GameStore.attic.setAtticVisibility(true);
                            this.soundManager.music.setVolume(0.001);
                        } else {
                            CameraStore.setTarget("");
                            GameStore.attic.setAtticVisibility(false);
                            this.soundManager.music.setVolume(0.05);
                        }
                    }
                }
            )
        );
    }

    createParcel(mesh, objectKindType) {
        let instance = BABYLON.MeshBuilder.CreateBox("box", {
            width: Math.abs(mesh.getBoundingInfo().boundingBox.extendSizeWorld.x),
            height: Math.abs(mesh.getBoundingInfo().boundingBox.extendSizeWorld.y),
            depth: Math.abs(mesh.getBoundingInfo().boundingBox.extendSizeWorld.z)
        }, this.scene);

        instance.material = this.scene.getMaterialByName("Clay");

        instance.position = new BABYLON.Vector3(
            0,
            this.attic.getBoundingInfo().boundingBox.maximumWorld.y,
            0
        );
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 9.81,
            restitution: 0.5
        }, this.scene);
        GameStore.attic.incrementParcelsNumberOf(objectKindType);
        this.scene.addMesh(instance);
        this.particleSystem.start();
        this.soundManager.dropParcel.play();
    }

    fall() {
        this.ground.position.y = this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y;
    }
}
