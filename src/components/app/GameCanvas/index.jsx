import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import {CameraManager} from "./CameraManager";
import Notification from "../notification/Notification";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

export default observer(class GameCanvas extends React.Component {
    sceneManager = null;
    scene = null;

    state = {
        ready: false
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas);
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
        return (
            <div>
                <div style={{
                    position: "fixed",
                    top: 10,
                    left: 10
                }}>
                    <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("Grenier"))}>Go to attic</button>
                    <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("tabouret.001"), CameraManager.CATALOG_OFFSET)}>Set target</button>
                    <button onClick={() => this.sceneManager.cameraManager.setTarget()}>reset target</button>
                </div>
                {(() => {
                    if(this.state.ready) {
                        return CatalogStore.getAllObjectKindWithActiveObject()
                            .map(objectKind => {
                                return Notification.create(objectKind, this.scene);
                            })
                    }
                })()}
                <canvas
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                    ref={(canvas) => this.canvas = canvas}
                />
            </div>
        );
    }
});
