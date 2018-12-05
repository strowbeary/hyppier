import * as BABYLON from "babylonjs";

export function showAxis(size = 1, position = new BABYLON.Vector3.Zero(), scene) {

    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero().add(position),
        new BABYLON.Vector3(size, 0, 0).add(position),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0).add(position),
        new BABYLON.Vector3(size, 0, 0).add(position),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0).add(position)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero().add(position),
        new BABYLON.Vector3(0, size, 0).add(position),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0).add(position),
        new BABYLON.Vector3(0, size, 0).add(position),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0).add(position)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);

    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero().add(position),
        new BABYLON.Vector3(0, 0, size).add(position),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95).add(position),
        new BABYLON.Vector3(0, 0, size).add(position),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95).add(position)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);

};
