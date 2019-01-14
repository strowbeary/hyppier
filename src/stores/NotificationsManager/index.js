import {types} from "mobx-state-tree";
import NotificationStore from "./NotificationStore";
import CoordsStore from "../CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/CoordsStore/CoordsStore";
import * as BABYLON from "babylonjs";

export const NotificationsManager =  types.model("NotificationsManager", {
    notifications: types.array(NotificationStore)
})
    .actions(self =>
        ({
            createFromMesh(lambdaMesh) {
                let position = lambdaMesh.mesh.position.add(
                    new BABYLON.Vector3(
                        0,
                        lambdaMesh.mesh.getBoundingInfo().boundingBox.maximum.y * lambdaMesh.mesh.scaling.y + 0.03,
                        0
                    )
                );
                const notification = NotificationStore.create({
                    position: CoordsStore.create({
                        x: position.x,
                        y: position.y,
                        z: position.z
                    }),
                    timeout: lambdaMesh.objectStore.objectTimeout,
                    position2D: CoordsStore.create({
                        x: 0,
                        y: 0,
                        z: 0
                    })
                });
                lambdaMesh.bindNotification(notification);
                self.notifications.push(notification);
            },
            updateNotificationsPositions(scene) {
                self.notifications.forEach(notificationStore => {
                    notificationStore.update2dPosition(scene)
                });
            }
        })
    )
    .create({
        notifications: []
    });
