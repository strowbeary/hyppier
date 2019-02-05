import * as BABYLON from "babylonjs";

export class Lights{
    init(scene) {
        //Light direction is directly down from a position one unit up, fast decay
        const light = new BABYLON.SpotLight(
            "Light1",
            new BABYLON.Vector3(-20, 20, -20),
            new BABYLON.Vector3(1, -1, 1),
            1,
            0,
            scene);
        light.intensity = 0.3;

        const light2 = new BABYLON.DirectionalLight(
            "Light2",
            new BABYLON.Vector3(0, -1, 0),
            scene);
        light2.intensity = 0.1;

        light.position = new BABYLON.Vector3(-4, 4, -4);
        light2.position = new BABYLON.Vector3(0, 1, 0);
        /*
        let lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
        lightSphere.position = light.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        let lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
        lightSphere2.position = light.position;
        lightSphere2.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 0, 1);
        */
        this.shadowGenerator = new BABYLON.ShadowGenerator(Math.pow(2, 13), light);
        this.shadowGenerator.setDarkness(0);
        this.shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.setTransparencyShadow(false);

    }
}
