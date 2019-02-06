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
        this.sceneManager = new SceneManager(this.canvas, () => {
            this.props.onReady();
            this.setState({
                ready: true
            });
        });
        this.scene = this.sceneManager;
        this.engine = this.sceneManager.engine;
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        this.engine.resize();
        this.sceneManager.cameraManager.updateCamera();
        this.scene.activeCamera.getProjectionMatrix(true);
    }

    render() {

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
                    <button onClick={() => this.sceneManager.cameraManager.setTarget("Attic")}>Go to attic</button>
                    <button onClick={() => this.sceneManager.cameraManager.setTarget()}>reset target</button>
                    <button onClick={() => this.sceneManager.atticManager.fall()}>Attic down</button>
                </div>
                {(() => {
                    if (this.state.ready) {
                        return CatalogStore
                            .getAllObjectKind()
                            .map((objectKind) => {
                                return (
                                    <ObjectKindUI
                                        ref={(ref) => ObjectKindUI.refs.push(ref)} objectKind={objectKind}
                                        scene={this.scene}
                                        key={objectKind.name}/>
                                );
                            })
                    }
                })()}

                    </React.Fragment>
                    );
                }
                });
