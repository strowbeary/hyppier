import {types} from "mobx-state-tree";
import CoordsStore from "../../CatalogStore/ObjectTypeStore/ObjectKindStore/LocationStore/CoordsStore/CoordsStore";
import * as BABYLON from "babylonjs";

export default types.model("NotificationStore", {
    position: types.maybe(CoordsStore),
})
    .views(self =>
        ({
            get2dPosition(scene) {
                const position2D = BABYLON.Vector3.Project(
                    self.position,
                    BABYLON.Matrix.Identity(),
                    scene.getTransformMatrix(),
                    scene.activeCamera.viewport.toGlobal(
                        scene.activeCamera.getEngine().getRenderWidth(),
                        scene.activeCamera.getEngine().getRenderHeight()
                    )
                );
                return {
                    x: position2D.x,
                    y: position2D.y
                }
            }
        })
    )
