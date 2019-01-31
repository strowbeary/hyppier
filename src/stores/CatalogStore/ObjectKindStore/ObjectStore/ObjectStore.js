import {types} from "mobx-state-tree";
import InfoStore from "./InfoStore/InfoStore";

const meshShelf = [];

export default types.model("ObjectStore", {
    name: types.string,
    adUrl: types.string,
    thumbnailUrl: types.string,
    closeButtonLabel: types.string,
    returnCatalogButtonLabel: types.string,
    catalogSlogan: types.string,
    modelUrl: types.string,
    model: types.maybe(types.number),
    infos: types.array(InfoStore)
})
    .actions(self =>
        ({
            setModel(lambdaMesh) {
                meshShelf.push(lambdaMesh);
                self.model = meshShelf.length - 1;
            },
            beforeDestroy() {
                delete meshShelf[self.model];
            }
        })
    )
    .views(self => ({
        getModel() {
            return meshShelf[self.model];
        }
    }));
