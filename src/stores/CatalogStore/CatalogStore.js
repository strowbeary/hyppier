import {types} from "mobx-state-tree";
import catalogDatas from "../../assets/datas";
import ObjectTypeStore from "./ObjectTypeStore/ObjectTypeStore";

const CatalogStore = types.model("CatalogStore", {
    objectTypes: types.array(ObjectTypeStore)
});
export default CatalogStore.create(catalogDatas);
