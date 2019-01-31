import {types} from "mobx-state-tree";
import CoordsStore from "./CoordsStore/CoordsStore";
import CatalogStore from "../../CatalogStore";

export default types.model("LocationStore", {
    previewObjectId: types.maybeNull(types.number),
    coordinates: CoordsStore,
    children: types.array(types.string),
    firstPosition: false,
    parent: types.maybe(types.string)
})
    .actions(self =>
        ({
            setPreviewObject(objectId) {
                self.previewObjectId = objectId;
            },
            removePreviewObject() {
                self.previewObjectId = null;
            },
            addChild(objectKindName, parentKindName) {
                if (self.children.indexOf(objectKindName) === -1) {
                    self.children.push(objectKindName);
                    CatalogStore.getObjectKind(objectKindName).location.setParent(parentKindName);
                }
            },
            setParent(objectKindName) {
                self.parent = objectKindName;
            },
            setPosition(vector3) {
                let vector = vector3;
                if (!self.firstPosition) {
                    self.firstPosition = true;
                    if (self.parent) {
                        vector = CatalogStore.getObjectKind(self.parent).location.toVector3().add(vector3);
                    }
                }
                const oldCoordinates = self.coordinates.toVector3();
                self.coordinates = CoordsStore.create({
                    x: vector.x,
                    y: vector.y,
                    z: vector.z
                });
                const finalVector = oldCoordinates.add(vector);
                self.children
                    .map(objectKindName => CatalogStore.getObjectKind(objectKindName).location)
                    .forEach(childLocation=> {
                        childLocation.setPosition(childLocation.toVector3().add(finalVector));
                    })
            }
        })
    )
    .views(self => ({
        toVector3() {
            return self.coordinates.toVector3();
        }
    }))
