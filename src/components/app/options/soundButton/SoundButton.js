import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import SvgButton from "../../svgButton/SvgButton";
import "./_soundButton.scss";

const SoundButton = observer(class SoundButton extends Component {

    toggleSound = () => {
        if (!this.isFullScreen) {
            BABYLON.Tools.RequestFullscreen(document.documentElement);
        }
        else {
            BABYLON.Tools.ExitFullscreen();
        }
    };

    render() {
        return (
            <button className={"soundButton"} onClick={this.toggleSound}>
                <SvgButton type={"soundOn"}/>
            </button>
        )
    }
});

export default SoundButton;
