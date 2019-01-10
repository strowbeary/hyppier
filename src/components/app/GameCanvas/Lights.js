import * as BABYLON from "babylonjs";

export class Lights{
    init(scene) {
        //Light direction is directly down from a position one unit up, fast decay
        const light = new BABYLON.SpotLight(
            "Light1",
            new BABYLON.Vector3(0, 20, -10),
            new BABYLON.Vector3(0, -1, 0.3),
            30,
            1,
            scene);
        light.position = new BABYLON.Vector3(0, 9, -9);
        light.intensity = 1;
        light.shadowMinZ = 10;
        light.shadowMaxZ = 70;

        let lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
        lightSphere.position = light.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        this.shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;

    }
}
