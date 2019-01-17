import React, {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import TimerStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const Notification = observer(class Notification extends Component {
    static refs = [];

    static create(objectKind, scene) {
        const ref = React.createRef();
        Notification.refs.push(ref);
        return <Notification objectKind={objectKind} scene={scene} hasTimer={true} key={objectKind.name}/>;
    }

    state = {
        position: new BABYLON.Vector3(0, 0, 0)
    };

    constructor(props) {
        super(props);
        this.timer = props.hasTimer ? TimerStore.create(props.objectKind.objectTimeout) : null;
        this.scene = props.scene;
        this.lambdaMesh = props.objectKind.objects[props.objectKind.activeObject].getModel();
        this.objectKind = props.objectKind;
    }

    componentDidMount() {
        this.scene.activeCamera.onViewMatrixChangedObservable.add(() => {
            this.setState({});
        });
        window.addEventListener('resize', () => {
            this.setState({});
        });
    }

    launchTimer() {
        if (this.timer) {
            this.timer.start();
        }
    }

    buildCatalog() {
        this.launchTimer();
        CatalogStore.openCatalog(CatalogStore.findobjectKindPath(this.objectKind.name));
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

        const size = 30;
        const dashSize = 2 * Math.PI * size;
        const rayon = (size - (3 / 2)) / 2;

        let style = {
            'top': y - size / 2,
            'left': x - size / 2
        };

        return (
            <div className="notification" style={style} onClick={() => this.buildCatalog()}>
                <div
                    className={`notification ${(this.timer.running && (this.timer.elapsedTime / this.timer.duration > 0.5)) ? "animated" : ""}`}>
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
