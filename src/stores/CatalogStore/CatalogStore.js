import {types} from "mobx-state-tree";
import ObjectFamilyStore from "./ObjectFamiliesStore/ObjectFamiliesStore";
import catalogDatas from "../../assets/datas";

const CatalogStore = types.model("CatalogStore", {
    objectFamilies: types.array(ObjectFamilyStore)
});
export default CatalogStore.create(catalogDatas);
