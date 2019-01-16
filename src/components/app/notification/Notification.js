import React from 'react';
import {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import TimerStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import {onPatch} from "mobx-state-tree";
import PopupStore from "../../../stores/PopupStore/PopupStore";

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
        this.lambdaMesh = this.objectKind.objects[props.objectKind.activeObject[0]].getModel();
        this.objectKindPath = CatalogStore.findobjectKindPath(this.objectKind.name);
        this.path = [...this.objectKindPath, props.objectKind.activeObject[0] + 1];
        this.objectKind.preloadNextObject();
        this.timer = TimerStore.create(props.objectKind.objectTimeout);
        this.timer.start();
        onPatch(this.timer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                let {x, y} = this.state.position;
                PopupStore.firstPosition.setPosition({x, y});
                PopupStore.addPopup(this.path);
            }});
    }

    componentDidMount() {
        this.scene.activeCamera.onViewMatrixChangedObservable.add(() => {
            this.setState({
                position: this.get2dPosition()
            })
        });
        window.addEventListener('resize', () => {
            this.setState({
                position: this.get2dPosition()
            });
        });
        this.setState({
            position: this.get2dPosition()
        });
    }

    get2dPosition() {
        return BABYLON.Vector3.Project(
            this.lambdaMesh.mesh.position.add(
                new BABYLON.Vector3(
                    0,
                    this.lambdaMesh.mesh.getBoundingInfo().boundingBox.maximum.y * this.lambdaMesh.mesh.scaling.y + 0.1,
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
        let {x, y} = this.state.position;

        const size = 30;
        const dashSize = 2 * Math.PI * size;
        const rayon = (size - (3 / 2)) / 2;

        let hide = (CatalogStore.isOpen || !this.timer.running) ? 'hide': '';
        let style = {
            'top': y - size / 2,
            'left': x - size / 2
        };

        return (
            <div className={`notification ${hide}`} style={style} onClick={() => this.buildCatalog()}>
                <div className={`notification ${(this.timer.running && (this.timer.elapsedTime / this.timer.duration > 0.5)) ? "animated" : ""}`}>
                    <svg height={size + 2} width={size + 2}>
                        <circle cx={size / 2} cy={size / 2} r={rayon} stroke="red" strokeWidth="2" fill="transparent"
                                strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                                strokeDasharray={dashSize}/>
                        <circle cx={size / 2} cy={size / 2} r={rayon - 5} fill="red"/>
                    </svg>
                </div>
            </div>
        )
    }
});


export default Notification;
