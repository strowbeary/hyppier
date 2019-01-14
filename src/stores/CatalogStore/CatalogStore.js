import {types} from "mobx-state-tree";
import catalogDatas from "../../assets/datas";
import ObjectTypeStore from "./ObjectTypeStore/ObjectTypeStore";

const CatalogStore = types.model("CatalogStore", {
    objectTypes: types.array(ObjectTypeStore)
})
    .views(self =>
        ({
            findobjectKindPath(objectKindName) {
                const objectTypeIndex = self.objectTypes
                    .findIndex(objectType => objectType.objectKinds.findIndex(objectKind => objectKind.name === objectKindName) !== -1);
                const objectKindIndex = self.objectTypes[objectTypeIndex].objectKinds.findIndex(objectKind => objectKind.name === objectKindName);
                return [objectTypeIndex, objectKindIndex];
            },
            getObjectKind(objectKindName) {
                const objectKindPath = this.findobjectKindPath(objectKindName);
                return self.objectTypes[objectKindPath[0]].objectKinds[objectKindPath[1]]
            },
            getEmptyLocation() {
                return self.objectTypes.map(objectType => {
                    return objectType.objectKinds
                        .filter(objectKind => {
                            return objectKind.activeObject === null
                        })
                        .filter(objectKind =>  typeof objectKind.location !== "undefined")
                        .map(objectKind => {
                            return objectKind.location;
                        })
                }).flat()
            },
            getAllActiveMeshes() {
                return self.objectTypes.map(objectType => {
                    return objectType.objectKinds
                        .filter(objectKind => {
                            return objectKind.activeObject !== null
                        })
                        .filter(objectKind => typeof objectKind.objects[objectKind.activeObject[0]].model !== "undefined")
                        .map(objectKind => {
                            return objectKind.objects[objectKind.activeObject[0]].getModel();
                        })
                }).flat()
            }
        })
    )
    .create(catalogDatas);

export default CatalogStore;
