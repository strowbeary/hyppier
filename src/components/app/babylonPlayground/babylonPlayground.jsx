import React from "react";
import {Component} from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import SceneComponent from './SceneComponent'; // import the component above linking to file we just created.

export default class BabylonPlayground extends Component {
    onSceneMount(e) {
        const {canvas, scene, engine} = e;

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

        /*const assetsManager = new BABYLON.AssetsManager(scene);
        const objTask1 = assetsManager.addMeshTask("scene task", "Macintosh.001", "/models/", "untitled4.babylon");
        //const objTask2 = assetsManager.addMeshTask("scene task", "Table", "/models/", "untitled.babylon");
        //const objTask3 = assetsManager.addMeshTask("scene task", "Table", "/models/", "untitled.babylon");
        assetsManager.load();

        objTask1.onSuccess= function (task) {
            for (var i = 0; i < task.loadedMeshes[0].material.subMaterials.length; i++) {
                console.log(task.loadedMeshes[0].material.subMaterials[i].id);
            }
        }*/

        var meshes;
        var macintosh;

        // LOAD FILE
        BABYLON.SceneLoader.LoadAssetContainer("/models/", "untitled4.babylon", scene, function (container) {
            meshes = container.meshes;
            var materials = container.materials;
            macintosh = meshes.find(mesh => mesh.id === "Macintosh.001");

            // Change materials on subMeshes with Materials in macintosh.material.subMaterials
            //macintosh.subMeshes[1].materialIndex = 0;
            //macintosh.subMeshes[0].materialIndex = 2;

            for (var i = 0; i < materials.length; i++) {
                console.log(materials[i].id);
            }
            // Adds all elements to the scene
            container.addAllToScene();

            // Adds specific mesh to scene
            scene.meshes.push(macintosh);

            // ANIMATION

            // Need to clone material before animation
            macintosh.material.subMaterials[0] = macintosh.material.subMaterials[0].clone();
            macintosh.material.subMaterials[1] = macintosh.material.subMaterials[1].clone();

            var animationBox = new BABYLON.Animation("myAnimation", "material.subMaterials.0.diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

            var keys = [];

            keys.push({
                frame: 0,
                value: macintosh.material.subMaterials[0].diffuseColor
            });

            keys.push({
                frame: 100,
                value: new BABYLON.Color3(1, 0, 0)
            });

            animationBox.setKeys(keys);
            macintosh.animations = [];
            macintosh.animations.push(animationBox);
            scene.beginAnimation(macintosh, 0, 100, true);
        });

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
