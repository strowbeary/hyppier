import React from 'react';
import {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import CountdownStore from "../../../stores/TimerStore/TimerStore";

const Notification = observer(class Notification extends Component {

    static updateProjectedPosition () { //update projected position for all notifications
        if (Notification.notificationsRef.length > 0)
            Notification.notificationsRef = Notification.notificationsRef.filter(notification => notification.current !== null);
        Notification.notificationsRef.forEach(notification => {
            if(notification.current !== null){
                notification.current.setProjectedPosition();
            }
        });
    };

    static notificationsRef = [];

    static create(notificationState, scene) {
        /*const ref = React.createRef();
        Notification.notificationsRef.push(ref);*/
        return <Notification notificationState={notificationState} scene={scene} hasTimer={true} key={notificationState.toString()}/>;
    }

    constructor(props) {
        super(props);
        this.notificationState = props.notificationState;
        this.timer = props.hasTimer ? CountdownStore.create(this.notificationState.timeout) : null;
        this.scene = props.scene;
        /*if(typeof props.mesh !== "undefined") {
            console.log(props.mesh.getBoundingInfo().boundingBox.maximumWorld.y);
            this.position = props.mesh.position.add(
                new BABYLON.Vector3(0, props.mesh.getBoundingInfo().boundingBox.maximum.y * props.mesh.scaling.y + 0.03, 0));
        } else {
            this.position = props.position.add(new BABYLON.Vector3(0, 0.03, 0));
        }*/
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
        let {x, y} = this.notificationState.get2dPosition(this.scene);
        let style = {
            'top': y - 25,
            'left': x - 25
        };
        let scale = (this.timer.elapsedTime / this.timer.duration * 0.5) + 0.5;
        let styleWrapper = this.timer.running ? {animationDuration: `${(this.timer.duration/this.timer.elapsedTime) * 150}ms`} : {animationDuration: '0ms'};

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
