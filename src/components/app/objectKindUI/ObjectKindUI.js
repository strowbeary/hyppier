import React, {Component} from "react";
import {observer} from "mobx-react";
import "./_objectKindUI.scss";
import * as BABYLON from "babylonjs";
import {SceneManager} from "../GameCanvas/SceneManager";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import Notification from "../notification/Notification";
import EmptySpace from "../emptySpace/EmptySpace";

const ObjectKindUI = observer(class ObjectKindUI extends Component {

    static refs = [];

    state = {
        position: new BABYLON.Vector3(0, 0, 0),
        visible: true
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
        this.objectKindIndex = CatalogStore.findobjectKindIndex(this.objectKind.name);
    }

    changeVisibility(value) {
        this.setState({
            visible: value
        })
    }

    getLambdaMesh() {
        if (this.objectKind.activeObject < this.objectKind.objects.length - 1
            && this.objectKind.activeObject !== null) {
            return this.objectKind.objects[this.objectKind.activeObject].getModel();
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.updatePosition();
    }

    updatePosition() {
        this.setState({
            position: this.get2dPosition()
        });
    }

    getYVectorValue() {
        if (this.getLambdaMesh() !== null) {
            return this.getLambdaMesh().mesh.getBoundingInfo().boundingBox.maximum.y * this.getLambdaMesh().mesh.scaling.y + 0.20
        } else {
            return 0;
        }
    }

    get2dPosition() {
        return BABYLON.Vector3.Project(
            this.objectKind.location.toVector3().add(
                new BABYLON.Vector3(
                    0,
                    this.getYVectorValue(),
                    0
                )
            ),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        );
    }

    buildCatalog() {
        ObjectKindUI.refs.filter(ref => {return ref !== null}).forEach(ref => ref.changeVisibility(false));
        CatalogStore.openCatalog(this.objectKindIndex);
    }

    render() {
        let {x, y} = this.state.position;

        if (isNaN(x) && isNaN(y)) {
            x = 15;
            y = 15;
        } else {
            x /= SceneManager.DEVICE_PIXEL_RATIO;
            y /= SceneManager.DEVICE_PIXEL_RATIO;
        }

        let style = {
            'top': y - 15,
            'left': x - 15
        };

        let hide = this.objectKind.activeObject < this.objectKind.objects.length - 1 && this.state.visible? '': 'hide';

        return (
            <div className={`objectKindUI ${hide}`} style={style}>
                {
                    this.objectKind.activeObject === null && <EmptySpace buildCatalog={() => {this.buildCatalog()}}/>
                }
                {
                    this.objectKind.activeObject !== null && this.objectKind.activeObject < this.objectKind.objects.length - 1 &&
                    <Notification objectKind={this.objectKind} buildCatalog={() => {this.buildCatalog()}} position={{x, y}} />
                }
            </div>
        )
    }

});

export default ObjectKindUI;