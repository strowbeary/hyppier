import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";
import * as BABYLON from "babylonjs";

export default types.model("LocationStore", {
    previewObject: types.maybeNull(types.refinement(types.array(types.number), value => value.length === 2)),
    coordinates: CoordsStore
})
    .actions(self =>
        ({
            setPreviewObject(object, tint) {
                self.previewObject = [object, tint];
            },
            removePreviewObject() {
                self.previewObject = null;
            }
        })
    )
    .views(self => ({
        toVector3() {
            return new BABYLON.Vector3(self.coordinates.x, self.coordinates.y, self.coordinates.z)
        }
    }))
