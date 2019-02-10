import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import CameraStore from "../../../stores/CameraStore/CameraStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import Message from "../message/Message";
import AboutModal from "../aboutModal/AboutModal";
import FullScreenButton from "../options/fullscreenButton/FullScreenButton";
import SoundButton from "../options/soundButton/SoundButton";
import {CSSTransitionGroup} from "react-transition-group";
import "../../../_variables.scss";

export default observer(class GameCanvas extends React.Component {
    sceneManager = null;
    scene = null;

    state = {
        ready: false,
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.onResize());
        this.sceneManager = new SceneManager(this.canvas, () => {
            this.props.onReady(this.sceneManager);
            this.setState({
                ready: true
            });
            TutoStore.reportAction("Intro", "appear");
        });
        this.scene = this.sceneManager.scene;
        this.engine = this.sceneManager.engine;
    }

    onResize() {
        this.scene.updateTransformMatrix(true);
        this.engine.resize();
        this.scene.activeCamera.getProjectionMatrix(true);
        this.sceneManager.cameraManager.updateFrustum();
    }

    launchLadderFall() {
        this.sceneManager.atticManager.launchLadderFall();
        this.sceneManager.gameManager.playGame();
    }

    render() {

        return (
            <React.Fragment>
                <canvas
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                    ref={(canvas) => this.canvas = canvas}
                />
                <div style={{
                    position: "fixed",
                    top: 10,
                    left: 10
                }}>
                    <button onClick={() => CameraStore.setTarget("Attic")}>Go to attic</button>
                    <button onClick={() => CameraStore.setTarget()}>reset target</button>
                    <button onClick={() => this.sceneManager.atticManager.fall()}>Attic down</button>
                </div>
                {(() => {
                    if (this.state.ready) {
                        return CatalogStore
                            .getAllObjectKind()
                            .map((objectKind) => {
                                return (
                                    <ObjectKindUI
                                        ref={(ref) => ObjectKindUI.refs.push(ref)} objectKind={objectKind}
                                        sceneManager={this.sceneManager}
                                        key={objectKind.name}/>
                                );
                            })
                    }
                })()}
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {TutoStore.displayTip() && !CatalogStore.isOpen &&
                    <Message message={TutoStore.getCurrentMessage()}
                             launchLadderFall={() => {
                                 this.launchLadderFall()
                             }}/>
                    }
                </CSSTransitionGroup>
                {this.state.ready &&
                <div className={"game__footer"}>
                    <AboutModal gameManager={this.sceneManager.gameManager}/>
                    <SoundButton soundManager={this.sceneManager.soundManager}/>
                    <FullScreenButton/>
                </div>
                }
            </React.Fragment>
        );
    }
});
