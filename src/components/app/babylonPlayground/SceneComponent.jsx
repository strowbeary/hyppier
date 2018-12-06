import {Engine, Scene} from "babylonjs";
import React, {Component} from "react";
import {assetsManager} from "./assetsManager";
import {showAxis} from "../../../utils/Axis";

export default class SceneComponent extends Component {

    scene;
    engine;
    canvas;

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

        assetsManager(scene);
        showAxis(scene, {
            size: 3,
            label: "Origin"
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
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResizeWindow);
    }

    onCanvasLoaded = (c) => {
        if (c !== null) {
            this.canvas = c;
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
        return (
            <canvas {...opts} ref={this.onCanvasLoaded} onContextMenu={e => e.preventDefault()}/>
        )
    }
}
