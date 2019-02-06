import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import SvgButton from "../../svgButton/SvgButton";
import "./_fullscreenButton.scss";

const FullScreenButton = observer(class FullScreenButton extends Component {

    componentDidMount() {
        document.addEventListener("fullscreenchange", this.onFullScreenChange, false);
        document.addEventListener("mozfullscreenchange", this.onFullScreenChange, false);
        document.addEventListener("webkitfullscreenchange", this.onFullScreenChange, false);
        document.addEventListener("msfullscreenchange", this.onFullScreenChange, false);
    }

    onFullScreenChange() {
        if (document.fullscreen !== undefined) {
            this.isFullScreen = document.fullscreen;
        } else if (document.mozFullScreen !== undefined) {
            this.isFullScreen = document.mozFullScreen;
        } else if (document.webkitIsFullScreen !== undefined) {
            this.isFullScreen = document.webkitIsFullScreen;
        } else if (document.msIsFullScreen !== undefined) {
            this.isFullScreen = document.msIsFullScreen;
        }
    }

    switchFullscreen = () => {
        if (!this.isFullScreen) {
            BABYLON.Tools.RequestFullscreen(document.documentElement);
        }
        else {
            BABYLON.Tools.ExitFullscreen();
        }
    };

    render() {
        return (
            <button className={"fullscreenButton"} onClick={this.switchFullscreen}>
                <SvgButton type={"fullscreen"}/>
            </button>
        )
    }
});

export default FullScreenButton;
