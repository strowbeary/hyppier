import {types} from "mobx-state-tree";
import catalogDatas from "./datas";
import ObjectFamilyStore from "./ObjectFamiliesStore/ObjectFamiliesStore";

const CatalogStore = types.model("CatalogStore", {
    objectFamilies: types.array(ObjectFamilyStore)
});

export default CatalogStore.create(catalogDatas);
