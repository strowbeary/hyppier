import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {CameraManager} from "./CameraManager";

export default observer(class GameCanvas extends React.Component {
    state = {
        canvas: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        meshes: []
    };
    sceneManager = null;
    scene = null;

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas, () => {
            this.setState({
                meshes: CatalogStore.getAllActiveMeshes()
            })
        });
        this.scene = this.sceneManager.scene;
        this.engine = this.sceneManager.engine;

        const notifications = [
            ...CatalogStore.getAllActiveMeshes().map(mesh => Notification.createFromMesh(mesh, this.scene)),
            ...CatalogStore.getEmptyLocation()
                .map(location => Notification.createFromVector3(location.toVector3()), this.scene)
        ];

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
