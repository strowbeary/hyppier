import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import Notification from "../notification/Notification";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import CameraStore from "../../../stores/CameraStore";
import EmptySpace from "../emptySpace/EmptySpace";

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
        this.scene.activeCamera.onViewMatrixChangedObservable.add(() => this.updateTrackingPosition());
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        this.engine.resize();
        this.sceneManager.cameraManager.updateCamera();
        this.scene.activeCamera.getProjectionMatrix(true);
        this.updateTrackingPosition();
    }

    updateTrackingPosition() {
        EmptySpace.refs.filter(ref => ref.current !== null).forEach(ref => ref.current.updatePosition());
        Notification.refs.filter(ref => ref.current !== null).forEach(ref => ref.current.updatePosition());
    }

    render() {
        if(this.sceneManager !== null) {
            this.sceneManager.cameraManager.setTarget(CameraStore.meshName, CameraStore.offset.toVector3());
        }
        return (
            <div>
                <div style={{
                    position: "fixed",
                    top: 10,
                    left: 10
                }}>
                    <button onClick={() => CameraStore.setTarget("Grenier")}>Go to attic</button>
                    <button onClick={() => CameraStore.setTarget()}>reset target</button>
                </div>
                {(() => {
                    if(this.state.ready) {
                        return CatalogStore.getAllObjectKindWithActiveObject()
                            .filter(objectKind => objectKind.activeObject[0] !== objectKind.objects.length -1)
                            .map(objectKind => {
                                return Notification.create(objectKind, this.scene);
                            })
                    }
                })()}
                {(() => {
                    if(this.state.ready) {
                        return CatalogStore.getEmptyLocation()
                            .map(objectKind => {
                                return EmptySpace.create(objectKind, this.scene);
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
