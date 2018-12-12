import Notification from "../../notification/Notification";
import React from "react";

export default class NotificationFactory {

    notificationsRef = [];

    constructor(scene) {
        this.scene = scene;
    }

    setCameraListener() { //listen to camera change
        this.scene.activeCamera.onViewMatrixChangedObservable.add(
            () => {this.updateProjectedPosition()}
        );
    }

    updateProjectedPosition() { //update projected position for all notifications
        if (this.notificationsRef.length > 0)
            this.notificationsRef.forEach(notification => notification.current.setProjectedPosition());
    }

    build(mesh) {
        this.notificationsRef.push(React.createRef());
        let lastNotificationRef = this.notificationsRef[this.notificationsRef.length-1];
        return <Notification mesh={mesh} ref={lastNotificationRef} scene={this.scene} time={1000}/>;
    }
}