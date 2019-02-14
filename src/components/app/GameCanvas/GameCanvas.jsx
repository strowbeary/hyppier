import * as React from "react";
import {observer} from "mobx-react";
import AboutModal from "../aboutModal/AboutModal";
import SoundButton from "../options/soundButton/SoundButton";
import GoodEndScreen from "../goodEndScreen/GoodEndScreen";
import GameStore from "../../../stores/GameStore/GameStore";
import * as BABYLON from "babylonjs";
import {SoundManager} from "./SoundManager";
import {AtticManager} from "./AtticManager";
import {GameManager} from "../../../GameManager";

export default observer(class GameCanvas extends React.Component {
    sceneManager = null;
    scene = null;

    state = {
        ready: false,
    };

    constructor(props) {
        super(props);
        this.engine = new BABYLON.Engine(
            document.createElement("canvas"),
            true,
            {preserveDrawingBuffer: true, stencil: true},
            true
        );
        this.scene = new BABYLON.Scene(this.engine);
        this.soundManager = new SoundManager(this.scene);
        this.atticManager = new AtticManager(this.scene, this.soundManager);
        this.gameManager = new GameManager(this.scene, this.atticManager);
    }

    render() {
        return (
            <React.Fragment>
                <GoodEndScreen soundManager={this.soundManager}/>
                <div className={"game__footer"}>
                    <AboutModal gameManager={this.gameManager}/>
                    <SoundButton soundManager={this.soundManager}/>
                </div>
            </React.Fragment>
        );
    }
});
