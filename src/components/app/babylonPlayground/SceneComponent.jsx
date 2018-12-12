import {assetsManager} from "./assetsManager";
import Notification from "../notification/Notification";
import LambdaObject from "../lambdaObject";
import 'babylonjs-loaders';
import * as BABYLON from "babylonjs";
import {Component} from "react";
import * as React from "react";
import {Scene, Engine} from "babylonjs";
export default class SceneComponent extends Component {

    scene;
    engine;
    canvas;
    pauseStatus = false;

    constructor(props) {
        super(props);
        this.state = {meshes: [], notifications: []}
    }

    onResizeWindow () {
        if (this.engine) {
            this.engine.resize();
        }
    }

    componentDidMount () {
        this.engine = new Engine(
            this.canvas,
            true,
            this.props.engineOptions,
            this.props.adaptToDeviceRatio
        );

        let scene = new Scene(this.engine);
        this.scene = scene;

        // LOAD FILE
        BABYLON.SceneLoader.LoadAssetContainer("/models/", "untitled4.babylon", scene, (container) => {
            let meshes = container.meshes;
            let materials = container.materials;

            this.setState({
                meshes: container.meshes
            });

            this.updateProjectionVector(meshes);

            // Adds all elements to the scene
            //container.addAllToScene();
        });

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
        this.scene.activeCamera.onViewMatrixChangedObservable.add(
            () => {
                this.updateProjectionVector();
            }
        )
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResizeWindow);
    }

    pause(e) {
        if (e.code === "Space" && this.scene.animatables.length > 0) {
            if (!this.pauseStatus) {
                this.pauseStatus = true;
                this.scene.animatables.forEach(animation => animation.pause());
            }
            else {
                this.pauseStatus = false;
                this.scene.animatables.forEach(animation => animation.restart());
            }
        }
    }

    updateProjectionVector(meshes) {
        let projectedPos = [];
        if (meshes) {
            projectedPos = meshes.map((mesh, i) =>
                <Notification position={this.getProjectedPosition(mesh)} time={5000} key={i}/>
            );
        } else {
            projectedPos = this.state.meshes.map((mesh, i) =>
                <Notification position={this.getProjectedPosition(mesh)} time={5000} key={i}/>
            );
        }
        this.setState({notifications: projectedPos});
    }

    onCanvasLoaded = (c) => {
        if (c !== null) {
            this.canvas = c;
        }
    };

    getProjectedPosition(mesh) {
        return BABYLON.Vector3.Project(mesh.position, mesh.computeWorldMatrix(true), this.scene.getTransformMatrix(), this.scene.activeCamera.viewport.toGlobal(this.scene.activeCamera.getEngine()))
    }

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

        const notifications = this.state.notifications;

        return (
            <div>
                {meshes}
                {notifications}
                <canvas {...opts} ref={this.onCanvasLoaded}/>
            </div>
        )
    }
}
