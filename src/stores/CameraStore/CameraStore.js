import {types} from "mobx-state-tree";
import * as BABYLON from "babylonjs";
import CoordsStore from "../CatalogStore/ObjectKindStore/LocationStore/CoordsStore/CoordsStore";

export default types.model("CameraStore", {
    meshName: types.string,
    offset: CoordsStore
})
    .actions(self =>
        ({
            setTarget(meshName = "", offset = new BABYLON.Vector3(0, 0, 0)) {
                self.meshName = meshName;
                self.offset = CoordsStore.create({
                    x: offset.x,
                    y: offset.y,
                    z: offset.z
                });
            }
        })
    )
    .create({
        meshName: "",
        offset: CoordsStore.create({
            x: 0,
            y: 0,
            z: 0
        })
    })
