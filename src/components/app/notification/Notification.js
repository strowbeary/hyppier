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

    static createFromVector3 = function(position, scene) {
        const ref = React.createRef();
        Notification.notificationsRef.push(ref);
        return <Notification position={position} ref={ref} scene={scene} time={1000} key={position.x}/>;
    };

    constructor(props) {
        super(props);
        this.timer = props.hasTimer ? CountdownStore.create(this.props.time) : null;
        /*if(typeof props.mesh !== "undefined") {
            console.log(props.mesh.getBoundingInfo().boundingBox.maximumWorld.y);
            this.position = props.mesh.position.add(
                new BABYLON.Vector3(0, props.mesh.getBoundingInfo().boundingBox.maximum.y * props.mesh.scaling.y + 0.03, 0));
        } else {
            this.position = props.position.add(new BABYLON.Vector3(0, 0.03, 0));
        }
        this.scene = props.scene;
        this.timer = props.hasTimer ? CountdownStore.create(this.props.time) : null;
        this.state = {projectedPosition: this.getProjectedPosition()};
        this.cameraInitVector = new BABYLON.Vector3(-5, 5, -5);
        this.cameraFocusVector = new BABYLON.Vector3(this.position.x - 3, this.position.y + 2, this.position.z - 2);*/
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
        this.focusOnMeshInit();
        this.scene.beginAnimation(this.scene.activeCamera, 0, 15, false, 1, () => {
            this.launchTimer();
            //this.update(1.25);
            this.updateCanvas();
        });
        this.launchTimer();
    }

    updateCanvas() {
        this.scene.updateTransformMatrix(true);
        Notification.updateProjectedPosition();
    }

    keysVertical(orthoTop, orthoBottom, from, to, ratio) {
        let zoomRatio = window.innerHeight/640;
        let keysTop = [];
        keysTop.push({
            frame: 0,
            value: from * zoomRatio * ratio
        });
        keysTop.push({
            frame: 15,
            value: to * zoomRatio * ratio
        });
        orthoTop.setKeys(keysTop);
        let keysBottom = [];
        keysBottom.push({
            frame: 0,
            value: -from * zoomRatio * ratio
        });
        keysBottom.push({
            frame: 15,
            value: -to * zoomRatio * ratio
        });
        orthoBottom.setKeys(keysBottom);
    }

    keysHorizontal(orthoLeft, orthoRight, from, to, ratio) {
        let zoomRatio = window.innerWidth/640;
        let keysRight = [];
        keysRight.push({
            frame: 0,
            value: from * zoomRatio * ratio
        });
        keysRight.push({
            frame: 15,
            value: to * zoomRatio * ratio
        });
        orthoRight.setKeys(keysRight);
        let keysLeft = [];
        keysLeft.push({
            frame: 0,
            value: -from * zoomRatio * ratio
        });
        keysLeft.push({
            frame: 15,
            value: -to * zoomRatio * ratio
        });
        orthoLeft.setKeys(keysLeft);
    }



    cameraPositionAnim() {
        const animationBox = new BABYLON.Animation(`${this.position.x}_animationFocus`, "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keys = [];
        keys.push({
            frame: 0,
            value: this.cameraInitVector
        });
        keys.push({
            frame: 15,
            value: this.cameraFocusVector
        });
        animationBox.setKeys(keys);
        let easingFunction = new BABYLON.ExponentialEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animationBox.setEasingFunction(easingFunction);
        this.scene.activeCamera.animations.push(animationBox);
    }

    focusOnMeshInit() {
        this.scene.activeCamera.animations = [];
        this.cameraBoundariesAnim();
        this.cameraPositionAnim();
    }

    render() {
        const dashSize = 157;
        //let {x, y} = this.state.projectedPosition || {x: 25, y: 60};
        /*let style = {
            'top': y - 60,
            'left': x - 25
        };*/
        let scale = ((this.timer.elapsedTime/this.timer.duration))*2 + 1;
        let style = {
            transform: `scale(${scale})`,
            top: "180px",
            left: "60px"
        };
        let styleWrapper = scale < 3 ? {animationDuration: `${(this.timer.duration/this.timer.elapsedTime) * 150}ms`} : {animationDuration: '0ms'};

        return (
            <div className="notification" style={style} onClick={() => this.launchTimer()}>
                <div className="notification__wrapper" style={styleWrapper}>
                    <svg height="60" width="60">
                        <circle cx="30" cy="30" r="25" stroke="red" strokeWidth="3" fill="transparent"
                                strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                                strokeDasharray={dashSize}/>
                        <circle cx="30" cy="30" r="15" fill="red"/>
                    </svg>
                </div>
            </div>
        )
    }
});


export default Notification;
