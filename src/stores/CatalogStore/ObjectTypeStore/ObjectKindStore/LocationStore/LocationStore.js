import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";
import CatalogStore from "../../../CatalogStore";

export default types.model("LocationStore", {
    previewObject: types.maybeNull(types.number),
    coordinates: CoordsStore,
    children: types.array(types.string)
})
    .actions(self =>
        ({
            setPreviewObject(objectId) {
                self.previewObjectId = objectId;
            },
            removePreviewObject() {
                self.previewObjectId = null;
            },
            addChild(objectKindName) {
                self.children.push(objectKindName);
            },
            setPosition(vector3) {
                const oldCoordinates = self.coordinates.toVector3();
                self.coordinates = CoordsStore.create({
                    x: vector3.x,
                    y: vector3.y,
                    z: vector3.z
                });
                self.children
                    .map(objectKindName => CatalogStore.getObjectKind(objectKindName).location)
                    .forEach(childLocation=> {
                        childLocation.setPosition(vector3.subtract(oldCoordinates))
                    })
            }
        })
    )
    .views(self => ({
        toVector3() {
            return self.coordinates.toVector3();
        }
    }))
