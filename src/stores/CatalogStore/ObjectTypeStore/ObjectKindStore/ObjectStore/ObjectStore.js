import {types} from "mobx-state-tree";
import TintStore from "./TintStore/TintStore";
import InfoStore from "./InfoStore/InfoStore";

const meshShelf = [];

export default types.model("ObjectStore", {
    name: types.string,
    adUrl: types.string,
    closeButtonLabel: types.string,
    returnCatalogButtonLabel: types.string,
    catalogSlogan: types.string,
    parcelSize: types.number,
    modelUrl: types.string,
    model: types.maybe(types.number),
    tints: types.array(TintStore),
    infos: types.array(InfoStore)
})
    .actions(self => ({
        setModel(lambdaMesh) {
            self.model = meshShelf.length;
            meshShelf.push(lambdaMesh);
        },
        beforeDestroy() {
            delete meshShelf[self.model];
        }
    }))
    .views(self => ({
        getModel() {
            return meshShelf[self.model];
        }
    }));
