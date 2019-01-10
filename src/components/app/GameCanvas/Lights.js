import * as BABYLON from "babylonjs";
export class Lights{
    init(scene) {
        //Light direction is directly down from a position one unit up, fast decay
        const light = new BABYLON.SpotLight(
            "Light1",
            new BABYLON.Vector3(-20, 20, -20),
            new BABYLON.Vector3(0, -1, 1),
            30,
            0,
            scene);
        light.intensity = 1;
        light.shadowMinZ = 15;
        light.shadowMaxZ = 40;

        let lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
        lightSphere.position = light.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);


        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        this.shadowGenerator.usePercentageCloserFiltering = true;
        this.shadowGenerator.setDarkness(0.25);
        this.shadowGenerator.bias = 0.00001

    }
}
