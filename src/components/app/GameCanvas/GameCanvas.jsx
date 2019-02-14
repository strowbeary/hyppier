import * as React from "react";
import {SceneManager} from "./SceneManager";
import {observer} from "mobx-react";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";
import ObjectKindUI from "../objectKindUI/ObjectKindUI";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import Message from "../message/Message";
import AboutModal from "../aboutModal/AboutModal";
import FullScreenButton from "../options/fullscreenButton/FullScreenButton";
import SoundButton from "../options/soundButton/SoundButton";
import GoodEndScreen from "../goodEndScreen/GoodEndScreen";
import GameStore from "../../../stores/GameStore/GameStore";
import BadEndScreen from "../badEndScreen/BadEndScreen";

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

    render() {
        if(GameStore.attic.isGameLost() || GameStore.hype.isGameWon()) {
            this.sceneManager.soundManager.music.pause();
        }
        return (
            <React.Fragment>
                {GameStore.attic.isGameLost() && GameStore.gameEnded &&
                    <BadEndScreen/>
                }
                {(this.state.ready &&
                GameStore.hype.isGameWon() &&
                GameStore.gameEnded) ||
                (GameStore.gameEnded && !GameStore.attic.isGameLost()&&
                    <GoodEndScreen soundManager={this.sceneManager.soundManager}/>)
                }
                <canvas
                    style={{
                        width: "100vw",
                        height: "100vh"
                    }}
                    ref={(canvas) => this.canvas = canvas}
                />
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
                {TutoStore.displayTip() && !CatalogStore.isOpen &&
                    <Message message={TutoStore.getCurrentMessage()}/>
                }
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
