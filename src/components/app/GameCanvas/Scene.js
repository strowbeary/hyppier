import * as BABYLON from "babylonjs";
import {GameStarter} from "../../../GameStarter";
import {GameWatcher} from "../../../GameWatcher";
import {LambdaMesh} from "./LambdaMesh";
import {MeshManager} from "./MeshManager";
import {Camera} from "./Camera";
import {Lights} from "./Lights";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import * as React from "react";

export class SceneManager {
    constructor(canvas, onReadyCB) {
        this.engine = new BABYLON.Engine(
            canvas,
            true,
            { preserveDrawingBuffer: true, stencil: true },
            false
        );
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new Camera(this.scene);
        this.camera.attachControl(canvas);
        const lights = new Lights();
        lights.init(this.scene);
        this.scene.shadowsEnabled = true;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [this.camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;
        defaultPipeline.grainEnabled = true;
        defaultPipeline.grain.intensity = 0.5;


        this.scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

        this.meshManager = new MeshManager(this.scene, lights);
        GameStarter.init(this.scene)
            .then(() => onReadyCB());
        GameWatcher
            .onUpdate((newMesh, oldMesh) => {
                this.meshManager.patch(new LambdaMesh(newMesh), oldMesh ? new LambdaMesh(oldMesh) : null)
            })
            .watch();

        this.engine.runRenderLoop(() => {
                this.scene.render();
        });
    }

    update() {
        return CatalogStore.getAllActiveMeshes().map(mesh => mesh.name).join(", ");
    }
}
