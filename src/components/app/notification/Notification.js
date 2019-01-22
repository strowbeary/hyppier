import React, {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import TimerStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {onPatch} from "mobx-state-tree";
import PopupStore from "../../../stores/PopupStore/PopupStore";
import {SceneManager} from "../GameCanvas/SceneManager";

const Notification = observer(class Notification extends Component {
    static refs = [];

    static create(objectKind, scene) {
        const ref = React.createRef();
        Notification.refs.push(ref);
        return <Notification objectKind={objectKind} scene={scene} key={objectKind.name} ref={ref}/>;
    }

    state = {
        position: new BABYLON.Vector3(0, 0, 0)
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
        this.lambdaMesh = this.objectKind.objects[props.objectKind.activeObject].getModel();
        this.objectKindPath = CatalogStore.findobjectKindPath(this.objectKind.name);
        this.path = [...this.objectKindPath, props.objectKind.activeObject + 1];
        this.timer = TimerStore.create(props.objectKind.objectTimeout);
        this.timer.start();
        onPatch(this.timer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                let {x, y} = this.state.position;
                PopupStore.firstPosition.setPosition({x, y});
                PopupStore.addPopup(this.path);
            }
        });
    }

    componentDidMount() {
        this.setState({
            position: this.get2dPosition()
        });
    }

    updatePosition() {
        this.setState({
            position: this.get2dPosition()
        });
    }

    get2dPosition() {
        return BABYLON.Vector3.Project(
            this.objectKind.location.toVector3().add(
                new BABYLON.Vector3(
                    0,
                    this.objectKind.objects[this.objectKind.activeObject].getModel().mesh.getBoundingInfo().boundingBox.maximum.y * this.lambdaMesh.mesh.scaling.y + 0.20,
                    0
                )
            ),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        );
    }


    buildCatalog() {
        this.timer.stop();
        CatalogStore.openCatalog(this.objectKindPath);
    }

    render() {
        let {x, y} = BABYLON.Vector3.Project(
            this.objectKind.location.toVector3().add(
                new BABYLON.Vector3(
                    0,
                    this.objectKind.objects[this.objectKind.activeObject].getModel().mesh.getBoundingInfo().boundingBox.maximum.y * this.lambdaMesh.mesh.scaling.y + 0.20,
                    0
                )
            ),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        );

        if (isNaN(x) && isNaN(y)) {
            x = 0;
            y = 0;
        }

        x /= SceneManager.DEVICE_PIXEL_RATIO;
        y /= SceneManager.DEVICE_PIXEL_RATIO;

        const dashSize = Math.PI * 60;

        let hide = (CatalogStore.isOpen || !this.timer.running) ? 'hide' : '';
        let style = {
            'top': y - 15,
            'left': x - 15
        };


        return (
            <div
                className={`notification ${hide} ${(this.timer.running && (this.timer.elapsedTime / this.timer.duration > 0.5)) ? "animated" : ""}`}
                style={style} onClick={() => this.buildCatalog()}>
                <svg height={32} width={32}>
                    <circle cx={15} cy={15} r={14.25} stroke="black" strokeWidth="2" fill="transparent"
                            strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                            strokeDasharray={dashSize}/>
                    <circle cx={15} cy={15} r={9.25} fill="black"/>
                </svg>
            </div>
        )
    }
});


export default Notification;
