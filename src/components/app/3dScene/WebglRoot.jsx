import React, {Component} from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import SceneComponent from './SceneComponent';

export default class WebglRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {width: window.innerWidth, height: window.innerHeight};
        window.addEventListener("resize", () => this.changeSceneLimits());
    }

    onSceneMount(e) {
        const {canvas, scene, engine} = e;

        scene.clearColor = new BABYLON.Color3(1, 1, 1);
        // This creates and positions a free camera (non-mesh)
        //const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        //camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        //camera.inputs.attached.mousewheel.wheelDeltaPercentage = 1;
        //camera.inputs.attached.mousewheel.wheelPrecision = 100;

        // Parameters : name, position, scene
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        // Targets the camera to a particular position. In this case the scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1;

        const defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
        defaultPipeline.samples = 4;
        defaultPipeline.fxaaEnabled = true;

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    }

    changeSceneLimits() {
        this.setState({
            width: window.innerWidth, height: window.innerHeight
        });
    }

    render() {
        return (
            <div>
                <SceneComponent onSceneMount={this.onSceneMount} width={this.state.width} height={this.state.height}/>
            </div>
        )
    }
}
