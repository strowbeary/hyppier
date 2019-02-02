import * as BABYLON from "babylonjs";
import {GameStarter} from "../../../GameStarter";
import {GameWatcher} from "../../../GameWatcher";
import {MeshManager} from "./MeshManager";
import {CameraManager} from "./CameraManager";
import {Lights} from "./Lights";
import {AtticManager} from "./AtticManager";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import {GameManager} from "./GameManager";

export class SceneManager {
    static DEVICE_PIXEL_RATIO = window.devicePixelRatio;
    constructor(canvas, onReadyCB) {
        this.engine = new BABYLON.Engine(
            canvas,
            true,
            { preserveDrawingBuffer: true, stencil: true },
            true
        );
        this.scene = new BABYLON.Scene(this.engine);
        this.cameraManager = new CameraManager(this.scene);
        this.camera = this.cameraManager.camera;
        //this.camera.attachControl(canvas);
        const lights = new Lights();
        lights.init(this.scene);
        this.scene.shadowsEnabled = true;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.grainEnabled = true;
        defaultPipeline.grain.intensity = 10;
        defaultPipeline.imageProcessingEnabled = true;

        const pipeline = new BABYLON.SSAORenderingPipeline("default", this.scene,1.0, [this.camera]);

        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        const ambient = 0.5;
        this.scene.ambientColor = new BABYLON.Color3(ambient, ambient, ambient);

        this.atticManager = new AtticManager(this.scene);
        this.gameManager = new GameManager(this.scene);
        this.meshManager = new MeshManager(this.scene, lights, this.gameManager);

        GameWatcher
            .onUpdate((newMesh, oldMesh, objectKindType, timer) => {
                if (objectKindType) {
                    oldMesh.clone && this.atticManager.createCarton(oldMesh.mesh);
                    this.atticManager.createCarton(oldMesh.mesh);
                }
                this.meshManager.patch(newMesh, oldMesh, timer);
                newMesh === null && oldMesh === null && this.updateTrackingPosition();
            })
            .watch()
            .then(() => {
                GameStarter.init(this.scene)
                    .then(() => {
                        this.atticManager.prepareGravity()
                    });
            });

        this.engine.runRenderLoop(() => {
                this.scene.render();
        });
    }

    updateTrackingPosition() {
        ObjectKindUI.refs.filter(ref => {return ref !== null}).forEach(ref => ref.updatePosition());
    }
}
