import * as BABYLON from "babylonjs";
import {GameStarter} from "../../../GameStarter";
import {GameWatcher} from "../../../GameWatcher";
import {MeshManager} from "./MeshManager";
import {CameraManager} from "./CameraManager";
import {Lights} from "./Lights";
import EmptySpace from "../emptySpace/EmptySpace";
import Notification from "../notification/Notification";

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
        this.camera.attachControl(canvas);
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

        this.meshManager = new MeshManager(this.scene, lights);

        GameWatcher
            .onUpdate((newMesh, oldMesh) => {
                this.meshManager.patch(newMesh, oldMesh);
                EmptySpace.refs.filter(ref => ref.current !== null).forEach(ref => ref.current.updatePosition());
                Notification.refs.filter(ref => ref.current !== null).forEach(ref => ref.current.updatePosition());
            })
            .watch(this.scene)
            .then(() => {
                GameStarter.init(this.scene)
                    .then(/*() => onReadyCB()*/);
            });

        this.engine.runRenderLoop(() => {
                this.scene.render();
        });
    }
}
