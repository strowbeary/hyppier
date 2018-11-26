import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import bedgeo from "../models/bed2.obj";
import bedmtl from "../models/bed2.mtl";

console.log(bedgeo);

export default function Bed(scene) {
    const materialLoader = new MTLLoader();
    materialLoader.load(bedmtl, materials => {
        materials.preload();
        const geometryloader = new OBJLoader();
        geometryloader.setMaterials(materials);
        geometryloader.load(
            bedgeo,
            object => {
                console.log(object);
                object.position.set(-50, -150, 0);
                object.rotation.set(0, Math.PI / 4, 0);
                scene.add(object);

            }
        );

    });

    this.update = function (time) {
        //update loop
    }
}
