import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import {CameraManager} from "./CameraManager";

export default observer(class GameCanvas extends React.Component {
    sceneManager = null;
    scene = null;

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas);
        this.scene = this.sceneManager.scene;
        this.engine = this.sceneManager.engine;
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        //Notification.updateProjectedPosition();
        this.engine.resize();
        this.sceneManager.cameraManager.updateCamera();
    }

    render() {
        return (
            <div>
                <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("Grenier"))}>Go to attic</button>
                <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("tabouret.001"), CameraManager.CATALOG_OFFSET)}>Set target</button>
                <button onClick={() => this.sceneManager.cameraManager.setTarget()}>reset target</button>
                {/*(() => {
                    NotificationsManager.notifications.map(notification => {
                        return Notification.createFromMesh();
                    })
                })()*/}
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
