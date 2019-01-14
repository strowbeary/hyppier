import * as BABYLON from "babylonjs";
export class Lights{
    init(scene) {
        //Light direction is directly down from a position one unit up, fast decay
        const light = new BABYLON.SpotLight(
            "Light1",
            new BABYLON.Vector3(-20, 20, -20),
            new BABYLON.Vector3(1, -1, 2),
            1,
            0,
            scene);
        light.intensity = 0.8;
        const light2 = new BABYLON.DirectionalLight(
            "Light2",
            new BABYLON.Vector3(1, -1, 2),
            scene);

        light2.position = new BABYLON.Vector3(-20, 20, -20);
        /*let lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
        lightSphere.position = light.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);*/

        this.shadowGenerator = new BABYLON.ShadowGenerator(Math.pow(2, 13), light);
        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.setTransparencyShadow(true);

    }
}
