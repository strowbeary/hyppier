import LambdaObject from "./effects/lambdaObject";
import {Component} from "react";
import * as React from "react";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {initGame} from "../../../GameStarter";
import Notification from "../notification/Notification";
import WebglRoot from "./WebglRoot";

export default class SceneComponent extends Component {
    scene;
    engine;
    canvas;
    pauseStatus = false;
    currentWidth;
    currentRatio = 1;

    constructor(props) {
        super(props);
        this.state = {
            meshes: [],
            emptyLocation: [],
            notifications: [],
            sceneRatio: 5};
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.currentRatio = this.currentWidth !== this.canvas.width? this.canvas.height / this.canvas.width : this.currentRatio;
        if (this.engine) {
            let {innerHeight, innerWidth} = window;
            WebglRoot.updateCamera(this.scene.activeCamera, this.currentRatio, innerHeight, innerWidth, this.state.sceneRatio);
            this.updateCanvas();
            this.engine.resize();
            this.currentWidth = this.canvas.width;
        }
    }

    updateCanvas() {
        this.scene.updateTransformMatrix(true);
        Notification.updateProjectedPosition();
    }

    componentDidMount () {
        this.engine = new BABYLON.Engine(
            this.canvas,
            true,
            this.props.engineOptions,
            false
        );

        let scene = new BABYLON.Scene(this.engine);
        this.scene = scene;

        if (typeof this.props.onSceneMount === 'function') {
            this.props.onSceneMount({
                scene,
                engine: this.engine,
                canvas: this.canvas
            });
        } else {
            console.error('onSceneMount function not available');
        }

        // Resize the babylon engine when the window is resized
        window.addEventListener('resize', this.onResizeWindow);
        window.addEventListener('keypress', this.pause.bind(this));


        scene.activeCamera.onViewMatrixChangedObservable
            .add(() => Notification.updateProjectedPosition());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeWindow);
    }

    pause(e) {
        if (e.code === "Space" && this.scene.animatables.length > 0) {
            if (!this.pauseStatus) {
                this.pauseStatus = true;
                this.scene.animatables.forEach(animation => animation.pause());
            } else {
                this.pauseStatus = false;
                this.scene.animatables.forEach(animation => animation.restart());
            }
        }
    }

    onCanvasLoaded = (c) => {
        if (c !== null) {
            this.canvas = c;
            this.currentWidth = this.canvas.width;
        }
    };

    render() {
        // 'rest' can contain additional properties that you can flow through to canvas:
        // (id, className, etc.)
        let {width, height} = this.props;

        let opts = {};

        if (width !== undefined && height !== undefined) {
            opts.width = width;
            opts.height = height;
        }

        const meshes = this.state.meshes.map(mesh =>
            <LambdaObject key={mesh.id} scene={this.scene} mesh={mesh} time={100}/>
        );

        const notifications = [
            ...this.state.meshes.map(mesh =>
                Notification.createFromMesh(mesh, this.scene)
            ),
            ...this.state.emptyLocation.map(location =>
                Notification.createFromVector3(new BABYLON.Vector3(
                    location.x,
                    location.y,
                    location.z
                ), this.scene)
            )
        ];

        return (
            <div>
                {meshes}
                {notifications}
                <canvas {...opts} ref={this.onCanvasLoaded}/>
            </div>
        )
    }
}
