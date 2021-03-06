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
            plane.position = options.position;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            //plane.showBoundingBox = true;
            plane.material.freeze();
            //plane.freezeWorldMatrix();
            plane.freezeNormals();
            plane.renderingGroupId = 1;
            return plane;
        };
        makeTextPlane(options.label, "black", Math.max(options.size, 2) / 10);
    }

    const axisX = BABYLON.Mesh.CreateLines("axisX", [
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
    axisX.enableEdgesRendering();
    axisX.edgesWidth = 2.0;
    axisX.edgesColor = new BABYLON.Color4(1, 0, 0, 1);
    axisX.freezeWorldMatrix();
    axisX.freezeNormals();
    axisX.renderingGroupId = 1;
    const axisY = BABYLON.Mesh.CreateLines("axisY", [
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
    axisY.enableEdgesRendering();
    axisY.edgesWidth = 2.0;
    axisY.edgesColor = new BABYLON.Color4(0, 1, 0, 1);
    axisY.freezeWorldMatrix();
    axisY.freezeNormals();
    axisY.renderingGroupId = 1;

    const axisZ = BABYLON.Mesh.CreateLines("axisZ", [
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
    axisZ.enableEdgesRendering();
    axisZ.edgesWidth = 2.0;
    axisZ.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
    axisZ.freezeWorldMatrix();
    axisZ.freezeNormals();
    axisZ.renderingGroupId = 1;
};
