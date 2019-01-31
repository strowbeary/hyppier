import {types} from "mobx-state-tree";
import catalogDatas from "../../assets/datas";
import ObjectKindStore from "./ObjectKindStore/ObjectKindStore";

const CatalogStore = types.model("CatalogStore", {
    objectKinds: types.array(ObjectKindStore),
    isOpen: false,
    objectKindIndex: types.maybeNull(types.number)
})
    .actions(self =>
        ({
            openCatalog(objectKindIndex) {
                self.objectKindIndex = objectKindIndex;
                self.isOpen = true;
            },
            closeCatalog() {
                self.objectKindIndex = null;
                self.isOpen = false;
            }
        })
    )
    .views(self =>
        ({
            findobjectKindIndex(objectKindName) {
               return self.objectKinds.findIndex(objectKind => objectKind.name === objectKindName);
            },
            getObjectKind(objectKindName) {
                return self.objectKinds.find(objectKind => objectKind.name === objectKindName);
            },
            getAllObjectKind() {
                return self.objectKinds.map(objectKind => {return objectKind});
            }
        })
    )
    .create(catalogDatas);

export default CatalogStore;
