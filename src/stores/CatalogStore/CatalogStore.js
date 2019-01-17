import {types} from "mobx-state-tree";
import catalogDatas from "../../assets/datas";
import ObjectTypeStore from "./ObjectTypeStore/ObjectTypeStore";

const CatalogStore = types.model("CatalogStore", {
    objectTypes: types.array(ObjectTypeStore),
    isOpen: false,
    objectKindPath: types.maybeNull(types.array(types.number))
})
    .actions(self =>
        ({
            openCatalog(objectKindPath) {
                self.objectKindPath = objectKindPath;
                self.isOpen = true;
            },
            closeCatalog() {
                self.objectKindPath = null;
                self.isOpen = false;
            }
        })
    )
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
                let test =  self.objectTypes.map(objectType => {
                    return objectType.objectKinds
                        .filter(objectKind => {
                            return objectKind.activeObject === null
                        })
                        .filter(objectKind =>  typeof objectKind.location !== "undefined")
                        .map(objectKind => {
                            return objectKind;
                        })
                }).flat();
                console.log(test);
                return test;
            },
            getAllObjectKindWithActiveObject() {
                return self.objectTypes.map(objectType => {
                    return objectType.objectKinds
                        .filter(objectKind => {
                            if(objectKind.activeObject !== null) {
                                return typeof objectKind.objects[objectKind.activeObject].model !== "undefined";
                            } else {
                                return false;
                            }
                        })
                        .map(objectKind => {
                            return objectKind
                        })
                }).flat()
            }
        })
    )
    .create(catalogDatas);

export default CatalogStore;
