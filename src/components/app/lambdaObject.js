import { Component } from 'react'
import * as BABYLON from "babylonjs";
import React from "react";

export default class lambdaObject extends Component {

    mesh = this.props.mesh;
    scene = this.props.scene;
    multimaterial = this.props.mesh.material.subMaterials !== undefined;
    time = this.props.time;

    constructor(props) {
        super(props);
        this.state = {projectedPosition: BABYLON.Vector3.Zero()};
        this.child = React.createRef();
    }

    changeMaterial() { //in order to change the version of object
        // Change materials on subMeshes with Materials in macintosh.material.subMaterials
        //this.props.subMeshes[1].materialIndex = 0;
        //this.props.subMeshes[0].materialIndex = 2;
    }

    cloneMaterial() {// Need to clone material before animation
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                this.mesh.material.subMaterials[i] = this.mesh.material.subMaterials[i].clone();
            }
        } else {
            this.mesh.material = this.mesh.material.clone();
        }
    }

    onPickAction(frameNumber) {
        this.mesh.animations = [];
        if (this.multimaterial) {
            for (let i = 0; i < this.mesh.material.subMaterials.length; i++) {
                let animationBox = new BABYLON.Animation(this.mesh.id+"-"+i, "material.subMaterials."+i+".diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                let keys = [];
                keys.push({
                    frame: 0,
                    value: this.mesh.material.subMaterials[i].diffuseColor
                });
                keys.push({
                    frame: frameNumber,
                    value: new BABYLON.Color3.Gray()
                });
                animationBox.setKeys(keys);
                this.mesh.animations.push(animationBox);
            }

            /*let children = this.mesh.material.subMaterials.map(material => {
                return new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    material,
                    'diffuseColor',
                    BABYLON.Color3.White(),
                    6000 //temps en milisecondes
                )
            });
            return new BABYLON.CombineAction(
                BABYLON.ActionManager.OnPickTrigger,
                children,
                new BABYLON.Condition(BABYLON.ActionManager)
            );*/
        } else {
            let animationBox = new BABYLON.Animation(this.mesh.id, "material.diffuseColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            let keys = [];
            keys.push({
                frame: 0,
                value: this.mesh.material.diffuseColor
            });
            keys.push({
                frame: frameNumber,
                value: new BABYLON.Color3.White()
            });
            animationBox.setKeys(keys);
            this.mesh.animations.push(animationBox);

            /*return new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnPickTrigger,
                this.mesh,
                'material.diffuseColor',
                BABYLON.Color3.White(),
                6000, //temps en milisecondes
            )*/
        }
    }

    setClickEvent() {
        //Get Click Event on object
        this.mesh.isPickable = true;
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => { //launch animation
                    this.onPickAction(this.time);
                    this.scene.beginAnimation(this.mesh, 0, this.time, true);
                }
            )
        );
    }

    componentDidMount () {
        this.scene.meshes.push(this.mesh);
        this.cloneMaterial();
        this.setClickEvent();
    }

    render () {
        return null;
    }
}