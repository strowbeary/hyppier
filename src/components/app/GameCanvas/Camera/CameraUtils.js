import * as BABYLON from "babylonjs";

function prepareKeys(orthoTop, orthoBottom, orthoLeft, orthoRight, from, to, ratio) {
    let verticalRatio = window.innerHeight/640;
    let keysTop = [];
    keysTop.push({
        frame: 0,
        value: from * verticalRatio * ratio
    });
    keysTop.push({
        frame: 15,
        value: to * verticalRatio * ratio
    });
    orthoTop.setKeys(keysTop);
    let keysBottom = [];
    keysBottom.push({
        frame: 0,
        value: -from * verticalRatio * ratio
    });
    keysBottom.push({
        frame: 15,
        value: -to * verticalRatio * ratio
    });
    orthoBottom.setKeys(keysBottom);
    let horizontalRatio = window.innerWidth/640;
    let keysRight = [];
    keysRight.push({
        frame: 0,
        value: from * horizontalRatio * ratio
    });
    keysRight.push({
        frame: 15,
        value: to * horizontalRatio * ratio
    });
    orthoRight.setKeys(keysRight);
    let keysLeft = [];
    keysLeft.push({
        frame: 0,
        value: -from * horizontalRatio * ratio
    });
    keysLeft.push({
        frame: 15,
        value: -to * horizontalRatio * ratio
    });
    orthoLeft.setKeys(keysLeft);
}
export function cameraBoundariesAnim() {
    const orthoLeft = new BABYLON.Animation(`${this.camera.name}_orthoLeftAnim`, "orthoLeft", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const orthoRight = new BABYLON.Animation(`${this.camera.name}_orthoRightAnim`, "orthoRight", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const orthoTop = new BABYLON.Animation(`${this.camera.name}_orthoTopAnim`, "orthoTop", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const orthoBottom = new BABYLON.Animation(`${this.camera.name}_orthoBottomAnim`, "orthoBottom", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    let ratio = window.innerHeight / window.innerWidth;

    prepareKeys(orthoTop, orthoBottom, orthoLeft, orthoRight, 10, 3, ratio);

    this.camera.animations.push(orthoTop);
    this.camera.animations.push(orthoBottom);
    this.camera.animations.push(orthoLeft);
    this.camera.animations.push(orthoRight);
}
