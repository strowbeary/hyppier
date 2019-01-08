import LambdaObject from "./effects/lambdaObject";
import {Component} from "react";
import * as React from "react";
import {Scene, Engine} from "babylonjs";
import {assetsManager} from "./utils/assetsManager";
import * as BABYLON from "babylonjs";
import NotificationFactory from "./utils/notificationFactory";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import WebglRoot from "./WebglRoot";

export default class SceneComponent extends Component {
    scene;
    engine;
    canvas;
    pauseStatus = false;
    notificationFactory;
    currentWidth;
    currentRatio = 1;

    constructor(props) {
        super(props);
        this.state = {meshes: [], notifications: [], locations: [], sceneRatio: 5};
        console.log(CatalogStore.toJSON());
        /*window.addEventListener('keypress', (e) => {if (e.code === "Space") {
            console.log(this.scene.activeCamera.position)
        }
        });*/
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
        NotificationFactory.updateProjectedPosition();
    }

    componentDidMount () {
        this.engine = new Engine(
            this.canvas,
            true,
            this.props.engineOptions,
            false
        );

        let scene = new Scene(this.engine);
        this.scene = scene;
        this.notificationFactory = new NotificationFactory(scene);

        assetsManager(scene, (location, isMesh) => {
            if (isMesh) {
                this.setState({
                    meshes: [...this.state.meshes, location]
                });
            } else {
                this.setState({
                    locations: [...this.state.locations, location]
                });
            }
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

        this.notificationFactory.setCameraListener();
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

        const addNotifications = this.state.locations.map(mesh =>
            this.notificationFactory.build(mesh, false, (value) => this.setState({
                sceneRatio: value
            }))
        );

        const notifications = this.state.meshes.map(mesh =>
            this.notificationFactory.build(mesh, true, (value) => this.setState({
                sceneRatio: value
            }))
        );

        return (
            <div>
                {meshes}
                {notifications}
                {addNotifications}
                <canvas {...opts} ref={this.onCanvasLoaded}/>
            </div>
        )
    }
}
