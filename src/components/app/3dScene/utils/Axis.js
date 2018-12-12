import * as BABYLON from "babylonjs";

export function showAxis(scene, options) {
    options = {
        position: new BABYLON.Vector3.Zero(),
        size: 1,
        label: "",
        ...options
    };
    if(options.label !== "") {
        var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {
                width: (size / 2 * options.label.length) * 500,
                height: size * 500
            }, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 0, null, `normal ${size * 10 * 36}px Arial`, color, "transparent", true);

            const plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", {
                width: size / 4 * options.label.length,
                height: size / 2
            }, scene);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            plane.position = options.position.add({
                x: (size / 4 * options.label.length) / 2 + size / 7,
                y: size / 4,
                z: 0
            });
            //plane.showBoundingBox = true;
            return plane;
        };
        makeTextPlane(options.label, "black", Math.max(options.size, 2) / 10);
    }

    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero().add(options.position),
        new BABYLON.Vector3(options.size, 0, 0).add(options.position),
        new BABYLON.Vector3(options.size * 0.95, 0.05 * options.size, 0).add(options.position),
        new BABYLON.Vector3(options.size, 0, 0).add(options.position),
        new BABYLON.Vector3(options.size * 0.95, -0.05 * options.size, 0).add(options.position),
        new BABYLON.Vector3(options.size, 0, 0).add(options.position),
        new BABYLON.Vector3(options.size * 0.95, 0, 0.05 * options.size).add(options.position),
        new BABYLON.Vector3(options.size, 0, 0).add(options.position),
        new BABYLON.Vector3(options.size * 0.95, 0, -0.05 * options.size).add(options.position)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero().add(options.position),
        new BABYLON.Vector3(0, options.size, 0).add(options.position),
        new BABYLON.Vector3(-0.05 * options.size, options.size * 0.95, 0).add(options.position),
        new BABYLON.Vector3(0, options.size, 0).add(options.position),
        new BABYLON.Vector3(0.05 * options.size, options.size * 0.95, 0).add(options.position),
        new BABYLON.Vector3(0, options.size, 0).add(options.position),
        new BABYLON.Vector3(0, options.size * 0.95, -0.05 * options.size).add(options.position),
        new BABYLON.Vector3(0, options.size, 0).add(options.position),
        new BABYLON.Vector3(0, options.size * 0.95, 0.05 * options.size).add(options.position),
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);

    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero().add(options.position),
        new BABYLON.Vector3(0, 0, options.size).add(options.position),
        new BABYLON.Vector3(0, -0.05 * options.size, options.size * 0.95).add(options.position),
        new BABYLON.Vector3(0, 0, options.size).add(options.position),
        new BABYLON.Vector3(0, 0.05 * options.size, options.size * 0.95).add(options.position),
        new BABYLON.Vector3(0, 0, options.size).add(options.position),
        new BABYLON.Vector3(-0.05 * options.size, 0, options.size * 0.95).add(options.position),
        new BABYLON.Vector3(0, 0, options.size).add(options.position),
        new BABYLON.Vector3(0.05 * options.size, 0, options.size * 0.95).add(options.position),
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);

};
