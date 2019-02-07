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
import {GameManager} from "../../../GameManager";
import TutoStore from "../../../stores/TutoStore/TutoStore";

const ObjectKindUI = observer(class ObjectKindUI extends Component {

    static refs = [];

    state = {
        position: {x: 0, y: 0},
        popupVisibility: false,
        popup: {focus: false, hovered: false}
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
        this.objectKindIndex = CatalogStore.findobjectKindIndex(this.objectKind.name);
    }

    changePopup(object) {
        this.setState({popup: Object.assign({}, this.state.popup, object)});
    }

    componentDidMount() {
        this.updatePosition();
    }

    isVisible() {
        return this.objectKind.replacementCounter < this.objectKind.objects.length - 1 && !GameStore.options.isPaused;
    }

    updatePosition() {
            this.setState({
                position: this.get2dPosition()
            });
    }

    get2dPosition() {
        let y = 0;
        let position = this.objectKind.location.toVector3();
        if(this.objectKind.activeObject !== null) {
            const lambdaMesh = this.objectKind.objects[this.objectKind.activeObject].getModel();
            if (lambdaMesh) {
                position = lambdaMesh.mesh.getBoundingInfo().boundingBox.maximumWorld
                    .subtract(lambdaMesh.mesh.getBoundingInfo().boundingBox.maximumWorld
                        .subtract(lambdaMesh.mesh.getBoundingInfo().boundingBox.minimumWorld)
                        .divide(new BABYLON.Vector3(2, 2, 2))
                    );
            }
        }

        return BABYLON.Vector3.Project(
            position,
            BABYLON.Matrix.Identity(),
            this.scene.scene.getTransformMatrix(),
            this.scene.camera.viewport.toGlobal(
                this.scene.camera.getEngine().getRenderWidth(),
                this.scene.camera.getEngine().getRenderHeight()
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

    closePopup(fromValidate) {
        if (this.notification) {
            this.notification.changeDelayTimer(fromValidate);
            this.notification.restartTimer();
            this.notification.delayTimer.start();
        }
        this.setState({
            popupVisibility: false
        });
    }

    buildCatalog() {
        this.scene.gameManager.pauseGame();
        this.objectKind.location.setPreviewObject(this.objectKind.replacementCounter + 1);
        CatalogStore.openCatalog(this.objectKindIndex);
        GameStore.setPipo("");
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

        let zIndex = 0;
        if (this.state.popup.focus) {
            zIndex++;
        }
        if (this.state.popup.hovered) {
            zIndex++;
        }

        let style = {
            'top': y - 15,
            'left': x - 15,
            'zIndex': zIndex
        };

        return (
            <div className={`objectKindUI ${hide}`} style={style}>
                {
                    this.objectKind.activeObject === null && TutoStore.currentMessage > 1 && <EmptySpace buildCatalog={() => {this.buildCatalog()}}/>
                }
                {
                    this.objectKind.activeObject !== null && TutoStore.currentMessage > 2 && this.objectKind.replacementCounter < this.objectKind.objects.length - 1 &&
                    <Notification ref={(ref) => this.notification = ref} objectKind={this.objectKind} buildCatalog={(timer) => {this.buildCatalog(timer)}} openPopup={() => this.openPopup()}/>
                }
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {
                        this.state.popupVisibility &&
                        <Popup ref={(ref) => (Popup.refs.indexOf(ref) === -1) && Popup.refs.push(ref)} index={this.objectKindIndex} position={{x, y}} closePopup={() => this.closePopup()} currentState={this.state.popup} changeCurrentState={(state) => {this.changePopup(state)}}/>
                    }
                </CSSTransitionGroup>
            </div>
        )
    }

});

export default ObjectKindUI;
