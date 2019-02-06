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
import flare from "./flare.png";
import * as cannon from "cannon";

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
        this.camera.attachControl(canvas);
        const lights = new Lights();
        lights.init(this.scene);
        this.scene.shadowsEnabled = true;

        const particleSystem = new BABYLON.ParticleSystem("particles", 1000, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture(flare, this.scene);
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        particleSystem.emitter = new BABYLON.Vector3(0, 3, 0);
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.1;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0);
        particleSystem.emitRate = 100;
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.75;
        particleSystem.disposeOnStop = false;
        particleSystem.targetStopDuration = 2;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.grainEnabled = true;
        defaultPipeline.grain.intensity = 30;
        defaultPipeline.imageProcessingEnabled = true;

        const ssaoRatio = {
            ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
            combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
        };

        const ssao = new BABYLON.SSAORenderingPipeline("ssao", this.scene, ssaoRatio, [this.camera]);
        ssao.fallOff = 0.000001;
        ssao.area = 1;
        ssao.radius = 0.0001;
        ssao.totalStrength = 2.0;
        ssao.base = 0;

        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        const ambient = 0.9;
        this.scene.ambientColor = new BABYLON.Color3(ambient, ambient, ambient);
        this.scene.blockMaterialDirtyMechanism = true;
        this.scene.useGeometryIdsMap = true;
        this.scene.useMaterialMeshMap = true;
        this.scene.useClonedMeshMap = true;


        this.scene.enablePhysics(null);

        this.atticManager = new AtticManager(this.scene, particleSystem);
        this.gameManager = new GameManager(this.scene, this.atticManager);
        this.meshManager = new MeshManager(this.scene, lights, this.gameManager);



        GameWatcher
            .onUpdate((newMesh, oldMesh, objectKindType, timer) => {
                if (objectKindType) {
                    if (oldMesh !== null) {
                        oldMesh.clones.forEach(clone => {
                            this.atticManager.createParcel(oldMesh.mesh, objectKindType);
                        });
                        this.atticManager.createParcel(oldMesh.mesh, objectKindType);
                        if (!CatalogStore.isOpen) {
                            if (GameStore.attic.shouldLaunchClueEvent(objectKindType)) {
                                this.gameManager.clueEvent = objectKindType;
                            }
                        } else {
                            this.gameManager.objectKindType = objectKindType;
                            this.gameManager.objectKindName = oldMesh.objectKindName;
                            this.gameManager.timer = timer;
                        }
                    } else if (newMesh !== null) {
                        this.gameManager.objectKindType = objectKindType;
                        this.gameManager.objectKindName = newMesh.objectKindName;
                        this.gameManager.timer = timer;
                    }
                }
                this.meshManager.patch(newMesh, oldMesh);
            })
            .watch()
            .then(() => {
                GameStarter.init(this.scene)
                    .then(() => {
                        this.atticManager.prepareGravity();
                        if (typeof onReadyCB === 'function') {
                            onReadyCB();
                        }
                    });
            });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}
