import * as BABYLON from "babylonjs";
import {GameStarter} from "../../../GameStarter";
import {GameWatcher} from "../../../GameWatcher";
import {MeshManager} from "./MeshManager";
import {CameraManager} from "./CameraManager";
import {Lights} from "./Lights";
import {AtticManager} from "./AtticManager";
import {GameManager} from "../../../GameManager";
import GameStore from "../../../stores/GameStore/GameStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import * as cannon from "cannon";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import {SoundManager} from "./SoundManager";

export class SceneManager {
    static DEVICE_PIXEL_RATIO = window.devicePixelRatio;

    constructor(canvas, onReadyCB) {
        this.engine = new BABYLON.Engine(
            canvas,
            true,
            {preserveDrawingBuffer: true, stencil: true},
            true
        );
        this.scene = new BABYLON.Scene(this.engine);
        this.cameraManager = new CameraManager(this.scene);
        this.camera = this.cameraManager.camera;
        // this.camera.attachControl(canvas);
        const lights = new Lights();
        lights.init(this.scene);
        this.scene.shadowsEnabled = true;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.imageProcessingEnabled = true;

        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        const ambient = 0.8;
        this.scene.ambientColor = new BABYLON.Color3(ambient, ambient, ambient);
        this.scene.blockMaterialDirtyMechanism = true;
        this.scene.useGeometryIdsMap = true;
        this.scene.useMaterialMeshMap = true;
        this.scene.useClonedMeshMap = true;

        this.scene.enablePhysics(null);

        this.soundManager = new SoundManager(this.scene);
        this.atticManager = new AtticManager(this.scene, this.soundManager);
        this.gameManager = new GameManager(this.scene, this.atticManager);
        this.meshManager = new MeshManager(this.scene, lights, this.gameManager);
        this.cameraManager.onOriginTargeted(() => {
            if (typeof this.gameManager.objectKindType !== 'undefined' &&
                this.gameManager.objectKindType !== null) {
                if (GameStore.attic.shouldLaunchClueEvent(this.gameManager.objectKindType)) {
                    this.gameManager.clueEvent = this.gameManager.objectKindType;
                }
                if (TutoStore.currentMessage === 4 && !TutoStore.end) {
                    this.atticManager.launchLadderFall();
                }
            }
            if (TutoStore.currentMessage === 2 && GameStore.hype.level > 0.5) {
                TutoStore.reportAction("FirstObject", "appear");
            }
            if (TutoStore.currentMessage !== 5 || TutoStore.end) {
                this.gameManager.playAfterCatalog();
            }
        });

        GameStarter.init(this.scene)
            .then(() => {
                GameWatcher
                    .onUpdate((newMesh, oldMesh, objectKindType) => {
                        if (objectKindType) {
                            if (oldMesh !== null) { //je remplace un objet
                                oldMesh.clones.forEach(clone => {
                                    this.atticManager.createParcel(oldMesh.mesh, objectKindType);
                                });
                                this.atticManager.createParcel(oldMesh.mesh, objectKindType);
                                if (!CatalogStore.isOpen) { //si j'ai remplacé dans la popup
                                    if (TutoStore.currentMessage === 4 && !TutoStore.end) {
                                        this.gameManager.pauseGame();
                                        this.atticManager.launchLadderFall();
                                    } else if (GameStore.attic.shouldLaunchClueEvent(objectKindType)) {
                                        this.gameManager.clueEvent = objectKindType;
                                    }
                                } else { //j'ajoute un objet
                                    this.gameManager.objectKindType = objectKindType;
                                    this.gameManager.objectKindName = oldMesh.objectKindName;
                                }
                            }
                        }
                        this.meshManager.patch(newMesh, oldMesh);
                    })
                    .watch()
                    .then(() => {
                        if (typeof onReadyCB === 'function') {
                            onReadyCB();
                        }
                        ObjectKindUI.refs.forEach(ref => ref && ref.updatePosition());

                        try {
                            this.atticManager.prepareGravity();
                            this.atticManager.prepareLadder();
                        } catch (e) {
                            console.error(e)
                        }

                    });
            });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}
