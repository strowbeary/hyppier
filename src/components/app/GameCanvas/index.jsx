import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";

export default observer(class GameCanvas extends React.Component {
    sceneManager = null;
    scene = null;

    state = {
        ready: false
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas, () => this.props.onReady());
        this.scene = this.sceneManager.scene;
        this.engine = this.sceneManager.engine;
        this.setState({
            ready: true
        });
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        this.engine.resize();
        this.sceneManager.cameraManager.updateCamera();
        this.scene.activeCamera.getProjectionMatrix(true);
    }

    render() {
        if (this.sceneManager !== null) {
            this.sceneManager.cameraManager.setTarget(CameraStore.meshName, CameraStore.offset.toVector3());
        }
        let objectKindUI = this.state.ready ? CatalogStore.getAllObjectKind().map((objectKind) => <ObjectKindUI
            ref={(ref) => ObjectKindUI.refs.push(ref)} objectKind={objectKind} scene={this.scene}
            key={objectKind.name}/>) : null;

        return (
            <React.Fragment>
                <canvas
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                    ref={(canvas) => this.canvas = canvas}
                />
                <div style={{
                    position: "fixed",
                    top: 10,
                    left: 10
                }}>
                    <button onClick={() => this.sceneManager.cameraManager.goToAttic()}>Go to attic</button>
                    <button onClick={() => this.sceneManager.cameraManager.goToRoom()}>reset target</button>
                    <button onClick={() => this.sceneManager.atticManager.fall()}>Attic down</button>
                </div>
                {objectKindUI}

            </React.Fragment>
        );
    }
});
