import React from "react";
import {Component} from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import SceneComponent from './SceneComponent'; // import the component above linking to file we just created.

export default class BabylonPlayground extends Component {
    onSceneMount(e) {
        const { canvas, scene, engine } = e;

        scene.clearColor = new BABYLON.Color3(1, 1, 1);
        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas);
        camera.inputs.attached.mousewheel.wheelDeltaPercentage = 30;
        camera.inputs.attached.mousewheel.wheelPrecision = 100;

        console.log(camera.inputs.attached);

        const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-2.00315, -0.89497, 3.50581), scene);
        const sun = new BABYLON.PointLight("DirectionalLight", new BABYLON.Vector3(0, 0, 0), scene);
        sun.intensity = 1;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;
        const assetsManager = new BABYLON.AssetsManager(scene);
        const objTask = assetsManager.addMeshTask("scene task", null, "/models/", "Scene.babylon");
        objTask.onSuccess = function (task) {
            task.loadedMeshes.forEach((mesh) => {
                mesh.convertToFlatShadedMesh();
                if(mesh.name === "Lumière") {
                    sun.position = mesh.position;
                }
            });
        };

        assetsManager.load();

        /*var test = new BABYLON.OBJFileLoader();
        console.log(test);*/

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        //var postProcess = new BABYLON.BlackAndWhitePostProcess("bandw", 1, camera);
        //var kernel = 32.0;
        //var postProcess = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), kernel, 0.25, camera);
        //var postProcess1 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), kernel, 1.0, camera);

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    }

    render() {
        return (
            <div>
                <SceneComponent onSceneMount={this.onSceneMount} width={window.innerWidth} height={window.innerHeight}/>
            </div>
        )
    }
}
