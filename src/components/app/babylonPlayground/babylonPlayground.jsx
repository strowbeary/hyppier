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
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1;

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        // Move the sphere upward 1/2 its height
        //sphere.position.y = 1;

        const assetsManager = new BABYLON.AssetsManager(scene);
        const objTask = assetsManager.addMeshTask("bed task", null, "/models/", "test_mtl_mac.obj");
        const tableTask = assetsManager.addMeshTask("bed task", null, "/models/", "test_mtl_table.obj");
        const litTask = assetsManager.addMeshTask("bed task", null, "/models/", "lit.obj");
        assetsManager.load();

        objTask.onSuccess = function (task) {
            task.loadedMeshes.forEach((mesh) => {
                mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                mesh.position = new BABYLON.Vector3(0, -3, 0);
                //mesh.material.diffuseColor = new BABYLON.Color3.White();
                //var curve = new BABYLON.ColorCurves();
                //curve.globalSaturation = -100;
                //mesh.material.cameraColorCurves = curve;
                //mesh.material.cameraColorCurvesEnabled = true;
            });
        };

        tableTask.onSuccess = function (task) {
            task.loadedMeshes.forEach((mesh) => {
                mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                mesh.position = new BABYLON.Vector3(0, -3, 0);
                //var curve = new BABYLON.ColorCurves();
                //curve.globalSaturation = -100;
                //mesh.material.cameraColorCurves = curve;
                //mesh.material.cameraColorCurvesEnabled = true;
            });
        };

        litTask.onSuccess = function (task) {
            task.loadedMeshes.forEach((mesh) => {
                mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                mesh.position = new BABYLON.Vector3(25, -3, 0);
                /*var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
                pbr.baseColor = new BABYLON.Color3.White();
                pbr.metallic = 0;
                pbr.roughness = 1.0;
                mesh.material = pbr;*/
                console.log(mesh.material);
            });
        };

        objTask.onError = function (task, message, exception) {
            console.log(message, exception);
        };

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
