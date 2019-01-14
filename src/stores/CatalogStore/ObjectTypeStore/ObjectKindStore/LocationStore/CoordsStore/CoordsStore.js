import {types} from "mobx-state-tree";
import * as BABYLON from "babylonjs";

export default types.model("CoordsStore", {
    x: types.number,
    y: types.number,
    z: types.number
})
    .views(self =>
        ({
            toVector3() {
                return new BABYLON.Vector3(
                    self.x,
                    self.y,
                    self.z
                )
            }
        })
    );
