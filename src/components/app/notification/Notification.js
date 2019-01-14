import React from 'react';
import {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import CountdownStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";

const Notification = observer(class Notification extends Component {

    static updateProjectedPosition = function () { //update projected position for all notifications
        if (Notification.notificationsRef.length > 0)
            Notification.notificationsRef = Notification.notificationsRef.filter(notification => notification.current !== null);
        Notification.notificationsRef.forEach(notification => {
            if(notification.current !== null){
                notification.current.setProjectedPosition();
            }
        });
    };

    static notificationsRef = [];

    static createFromMesh = function (mesh, scene) {
        const ref = React.createRef();
        Notification.notificationsRef.push(ref);
        return <Notification mesh={mesh} ref={ref} scene={scene} time={1000} key={mesh.name}/>;
    };

    constructor(props) {
        super(props);
        this.timer = props.hasTimer ? CountdownStore.create(this.props.time) : null;
        if(typeof props.mesh !== "undefined") {
            console.log(props.mesh.getBoundingInfo().boundingBox.maximumWorld.y);
            this.position = props.mesh.position.add(
                new BABYLON.Vector3(0, props.mesh.getBoundingInfo().boundingBox.maximum.y * props.mesh.scaling.y + 0.03, 0));
        } else {
            this.position = props.position.add(new BABYLON.Vector3(0, 0.03, 0));
        }
        this.scene = props.scene;
        this.timer = props.hasTimer ? CountdownStore.create(this.props.time) : null;
        this.state = {projectedPosition: this.getProjectedPosition()};
    }

    setProjectedPosition() {
        this.setState({projectedPosition: this.getProjectedPosition()});
    }

    getProjectedPosition() {
        return BABYLON.Vector3.Project(
            this.position,
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        )

    }

    launchTimer() {
        if (this.timer) {
            this.timer.start();
        }
    }

    buildCatalog() {
        this.launchTimer();
    }





    render() {
        const dashSize = 157;
        //let {x, y} = this.state.projectedPosition || {x: 25, y: 60};
        /*let style = {
            'top': y - 60,
            'left': x - 25
        };*/
        let scale = (this.timer.elapsedTime / this.timer.duration * 0.4) + 0.6;
        let style = {
            top: "180px",
            left: "60px"
        };
        let styleWrapper = this.timer.running ? {animationDuration: `${(this.timer.duration/this.timer.elapsedTime) * 150 * Math.exp(this.timer.elapsedTime-(this.timer.duration - 500))}ms`} : {animationDuration: '0ms'};

        return (
            <div className="notification" style={style} onClick={() => this.launchTimer()}>
                <div className="notification__wrapper" style={styleWrapper}>
                    <svg height="60" width="60">
                        <g transform={`scale(${scale})`}>
                            <circle cx="30" cy="30" r="25" stroke="red" strokeWidth="3" fill="transparent"
                                    strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                                    strokeDasharray={dashSize}/>
                            <circle cx="30" cy="30" r="15" fill="red"/>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
});


export default Notification;
