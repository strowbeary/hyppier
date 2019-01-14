import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import {CameraManager} from "./CameraManager";
import Notification from "../notification/Notification";
import {NotificationsManager} from "../../../stores/NotificationsManager";

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
        this.engine.resize();
        this.sceneManager.cameraManager.updateCamera();
        NotificationsManager.updateNotificationsPositions(this.scene);
    }

    render() {
        return (
            <div>
                <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("Grenier"))}>Go to attic</button>
                <button onClick={() => this.sceneManager.cameraManager.setTarget(this.scene.getMeshByName("tabouret.001"), CameraManager.CATALOG_OFFSET)}>Set target</button>
                <button onClick={() => this.sceneManager.cameraManager.setTarget()}>reset target</button>
                {(() => {
                    return NotificationsManager.notifications.map(notificationStore => {
                        return Notification.create(notificationStore, this.scene);
                    })
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
