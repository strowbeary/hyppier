import {PointLight} from "three";

export function GeneralLights(scene) {

    const light = new PointLight("#ababab", 1);
    light.position.set(0, 14, 0);
    scene.add(light);

    this.update = function (time) {
    }
}
