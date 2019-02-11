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
        this.ladder.unfreezeWorldMatrix();
        BABYLON.Animation.CreateAndStartAnimation('ladderFall', this.ladder, 'position.y', 30, 30, 10, this.originalPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => {
            let spriteManagerDust = new BABYLON.SpriteManager("treesManager", "/img/Pipo-Idle.png", 1, 256, this.scene);
            spriteManagerDust.renderingGroupId = 1;
            let dust = new BABYLON.Sprite("dust", spriteManagerDust);
            dust.position = new BABYLON.Vector3(this.ladder.position.x, this.originalPosition, this.ladder.position.z);
            dust.disposeWhenFinishedAnimating = true;
            dust.playAnimation(0, 100, false, 5);
            this.ladder.freezeWorldMatrix();
            this.boxLadder = BABYLON.MeshBuilder.CreateBox("box", {
                height: this.ladder.getBoundingInfo().boundingBox.extendSize.y * 2,
                width: this.ladder.getBoundingInfo().boundingBox.extendSize.x * 2,
                depth: this.ladder.getBoundingInfo().boundingBox.extendSize.z * 2
            }, this.scene);
            this.boxLadder.position = this.ladder.getBoundingInfo().boundingBox.centerWorld;
            this.boxLadder.showBoundingBox = true;
            this.ladder.showBoundingBox = true;
            this.boxLadder.visibility = 0;
            this.boxLadder.freezeWorldMatrix();
            this.soundManager.ladderDrop.play();
            this.setClickEvent();
        });
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
    }

    setClickEvent() {
        this.boxLadder.isPickable = true;
        this.boxLadder.actionManager = new BABYLON.ActionManager(this.scene);
        this.boxLadder.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => { //DO SOMETHING ON CLICK
                    if (!CatalogStore.isOpen) {
                        TutoStore.reportAction("Attic", "actioned");
                        if (CameraStore.meshName !== "Attic") {
                            CameraStore.setTarget("Attic");
                            GameManagerInstance.pauseGame();
                            GameStore.attic.setAtticVisibility(true);
                            this.soundManager.music.setVolume(0.008);
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
        let instance = this.scene.getMeshByName("Box")
            .clone("Parcel" + mesh.name, null);
        instance.scalingDeterminant = 1 + mesh.getBoundingInfo().boundingBox.extendSizeWorld.length();


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
        instance.setEnabled(true);
        console.log(instance);
        this.scene.addMesh(instance);
        this.particleSystem.start();
        this.soundManager.dropParcel.play();
    }

    fall() {
        CatalogStore.getAllObjectKind().forEach(objectKind => {
            if(objectKind.activeObject !== null){
                //objectKind.objects[objectKind.activeObject].getModel().enableCollision();
            }
        });
        this.ground.position.y = this.scene.getMeshByName("Room").getBoundingInfo().boundingBox.minimumWorld.y;
    }
}
