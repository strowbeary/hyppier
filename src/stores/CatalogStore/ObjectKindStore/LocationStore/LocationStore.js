import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";

export default types.model("LocationStore", {
    previewObjectId: types.maybeNull(types.number),
    coordinates: CoordsStore
})
    .actions(self =>
        ({
            setPreviewObject(objectId) {
                self.previewObjectId = objectId;
            },
            removePreviewObject() {
                self.previewObjectId = null;
            },
            setPosition(vector3) {
                self.coordinates = CoordsStore.create({
                    x: vector3.x,
                    y: vector3.y,
                    z: vector3.z
                });
            }
        })
    )
    .views(self => ({
        toVector3() {
            return self.coordinates.toVector3();
        }
    }))
