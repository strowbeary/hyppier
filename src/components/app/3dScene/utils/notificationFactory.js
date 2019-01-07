import Notification from "../../notification/Notification";
import React from "react";

export default class NotificationFactory {

    static notificationsRef = [];

    constructor(scene) {
        this.scene = scene;
    }

    setCameraListener() { //listen to camera change
        this.scene.activeCamera.onViewMatrixChangedObservable.add(
            () => {NotificationFactory.updateProjectedPosition()}
        );
    }

    static updateProjectedPosition() { //update projected position for all notifications
        if (NotificationFactory.notificationsRef.length > 0)
            NotificationFactory.notificationsRef = NotificationFactory.notificationsRef.filter(notification => notification.current !== null);
            NotificationFactory.notificationsRef.forEach(notification => {
                if(notification.current !== null){
                    notification.current.setProjectedPosition();
                }
            });
    }

    build(mesh, isMesh) {
        const ref = React.createRef();
        NotificationFactory.notificationsRef.push(ref);
        return <Notification mesh={mesh} ref={ref} scene={this.scene} time={1000} key={mesh.name} hasTimer={isMesh}/>;
    }
}
