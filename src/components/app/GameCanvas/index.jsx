import * as React from "react";
import {SceneManager} from "./Scene";

export default class GameCanvas extends React.Component {
    state = {
        canvas: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    sceneManager = null;
    scene= null;

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas);
        this.scene = this.sceneManager.scene;
        this.engine = this.sceneManager.engine
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        //Notification.updateProjectedPosition();
        this.engine.resize();
    }

    render() {
        let {width, height} = this.state.canvas;

        let opts = {};

        if (width !== undefined && height !== undefined) {
            opts.width = width;
            opts.height = height;
        }
        return (
            <div>
                <canvas {...opts} ref={(canvas) => this.canvas = canvas}/>
            </div>
        );
    }
}
