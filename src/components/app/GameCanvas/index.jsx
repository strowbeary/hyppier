import * as React from "react";
import {SceneManager} from "./Scene";
import {observer} from "mobx-react";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

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
        /*const notifications = [
            ...CatalogStore.getAllActiveMeshes().map(mesh => Notification.createFromMesh(mesh, this.scene)),
            ...CatalogStore.getEmptyLocation()
                .map(location => Notification.createFromVector3(location.toVector3()), this.scene)
        ];

                {notifications}
        */
        return (
            <div>
                {CatalogStore.getAllActiveMeshes().map(mesh => mesh.name).join(", ")}
                <canvas {...opts} ref={(canvas) => this.canvas = canvas}/>
            </div>
        );
    }
});
