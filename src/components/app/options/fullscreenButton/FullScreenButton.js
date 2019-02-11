import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import fullscreen from "../../../../assets/img/fullscreen.svg";
import fullscreenHover from "../../../../assets/img/fullscreen-hover.svg";

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
            this.isFullScreen = true;
            BABYLON.Tools.RequestFullscreen(document.documentElement);
        }
        else {
            this.isFullScreen = false;
            BABYLON.Tools.ExitFullscreen();
        }
    };

    render() {
        return (
            <button className="fullscreenButton svgButton" onClick={this.switchFullscreen}>
                <img className="svgButton__main" src={fullscreen} alt="fullscreen"/>
                <img className="svgButton__hover" src={fullscreenHover} alt="fullscreen"/>
            </button>
        )
    }
});

export default FullScreenButton;
