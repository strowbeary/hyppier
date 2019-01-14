import React from 'react';
import {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import CountdownStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const Notification = observer(class Notification extends Component {

    static create(objectKind, scene) {
        return <Notification objectKind={objectKind} scene={scene} hasTimer={true} key={objectKind.name}/>;
    }

    state = {
        position: new BABYLON.Vector3(0, 0, 0)
    };

    constructor(props) {
        super(props);
        this.timer = props.hasTimer ? CountdownStore.create(props.objectKind.objectTimeout) : null;
        this.scene = props.scene;
        this.lambdaMesh = props.objectKind.objects[props.objectKind.activeObject[0]].getModel();
        this.objectKind = props.objectKind;

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
        const dashSize = 157;
        let {x, y} = this.state.position;
        let style = {
            'top': y - 25,
            'left': x - 25
        };
        let scale = (this.timer.elapsedTime / this.timer.duration * 0.5) + 0.5;
        let styleWrapper = this.timer.running ? {animationDuration: `${(this.timer.duration / this.timer.elapsedTime) * 150}ms`} : {animationDuration: '0ms'};

        return (
            <div className="notification" style={style} onClick={() => this.buildCatalog()}>
                <div className="notification__wrapper" style={styleWrapper}>
                    <svg height="50" width="50">
                        <g transform={`translate(${25 * (1 - scale)}, ${25 * (1 - scale)}) scale(${scale})`}>
                            <circle cx="25" cy="25" r="23.5" stroke="red" strokeWidth="3" fill="transparent"
                                    strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                                    strokeDasharray={dashSize}/>
                            <circle cx="25" cy="25" r="15" fill="red"/>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
});


export default Notification;
