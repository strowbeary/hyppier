import React, {Component} from "react";
import {observer} from "mobx-react";
import "./_objectKindUI.scss";
import * as BABYLON from "babylonjs";
import {SceneManager} from "../GameCanvas/SceneManager";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import Notification from "./notification/Notification";
import EmptySpace from "./emptySpace/EmptySpace";
import Popup from "./popup/Popup";
import {CSSTransitionGroup} from "react-transition-group";
import GameStore from "../../../stores/GameStore/GameStore";
import {GameManager} from "../GameCanvas/GameManager";

const ObjectKindUI = observer(class ObjectKindUI extends Component {

    static refs = [];

    state = {
        position: {x: 0, y: 0},
        popupVisibility: false
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
        this.objectKindIndex = CatalogStore.findobjectKindIndex(this.objectKind.name);
    }

    getLambdaMesh() {
        if (this.objectKind.replacementCounter < this.objectKind.objects.length - 1
            && this.objectKind.replacementCounter > -1) {
            return this.objectKind.objects[this.objectKind.replacementCounter].getModel();
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.updatePosition();
    }

    isVisible() {
        return this.objectKind.replacementCounter < this.objectKind.objects.length - 1 && !GameStore.options.isPaused;
    }

    updatePosition() {
        if (this.isVisible()) {
            this.setState({
                position: this.get2dPosition()
            });
        }
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

    openPopup() {
        if (this.objectKind.replacementCounter < this.objectKind.objects.length - 1) {
            this.setState({
                popupVisibility: true
            });
        }
    }

    closePopup() {
        if (this.notification) {
            this.notification.restartTimer();
            this.notification.delayTimer.start();
        }
        this.setState({
            popupVisibility: false
        });
    }

    buildCatalog(timer) {
        GameManager.pauseCatalog(timer);
        CatalogStore.openCatalog(this.objectKindIndex);
    }

    render() {
        let hide = this.objectKind.replacementCounter < this.objectKind.objects.length - 1 && !GameStore.options.isPaused? '': 'hide';
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

        return (
            <div className={`objectKindUI ${hide}`} style={style}>
                {
                    this.objectKind.replacementCounter === -1 && <EmptySpace buildCatalog={() => {this.buildCatalog()}}/>
                }
                {
                    this.objectKind.replacementCounter > -1 && this.objectKind.replacementCounter < this.objectKind.objects.length - 1 &&
                    <Notification ref={(ref) => this.notification = ref} objectKind={this.objectKind} buildCatalog={(timer) => {this.buildCatalog(timer)}} openPopup={() => this.openPopup()}/>
                }
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {
                        this.state.popupVisibility &&
                        <Popup ref={(ref) => Popup.refs.push(ref)} index={this.objectKindIndex} position={{x, y}} closePopup={() => this.closePopup()}/>
                    }
                </CSSTransitionGroup>
            </div>
        )
    }

});

export default ObjectKindUI;