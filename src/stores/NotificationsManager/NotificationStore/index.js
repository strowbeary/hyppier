import {types} from "mobx-state-tree";
import CoordsStore from "../../CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/CoordsStore/CoordsStore";
import * as BABYLON from "babylonjs";

export default types.model("NotificationStore", {
    position: types.maybe(CoordsStore),
    timeout: types.number,
    position2D: CoordsStore
})
    .actions(self =>
        ({
            setPosition(vector) {
                self.position = CoordsStore.create({
                    x: vector.x,
                    y: vector.y,
                    z: vector.z
                })
            },
            update2dPosition(scene) {
                const position = BABYLON.Vector3.Project(
                    self.position.toVector3(),
                    BABYLON.Matrix.Identity(),
                    scene.getTransformMatrix(),
                    scene.activeCamera.viewport.toGlobal(
                        scene.activeCamera.getEngine().getRenderWidth(),
                        scene.activeCamera.getEngine().getRenderHeight()
                    )
                );
                self.position2D = CoordsStore.create({
                    x: position.x,
                    y: position.y,
                    z: position.z
                });
            }
        })
    )
    .views(self =>
        ({
            get2dPosition() {
                return {
                    x: self.position2D.x,
                    y: self.position2D.y
                }
            }
        })
    )
