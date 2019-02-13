import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import fullscreen from "../../../../assets/img/fullscreen.svg";
import fullscreenHover from "../../../../assets/img/fullscreen-hover.svg";
import fullscreenClose from "../../../../assets/img/fullscreen-close.svg";
import fullscreenCloseHover from "../../../../assets/img/fullscreen-close-hover.svg";
import soundON from "../../../../assets/img/soundON.svg";
import soundONHover from "../../../../assets/img/soundON-hover.svg";
import soundOFF from "../../../../assets/img/soundOFF.svg";
import soundOFFHover from "../../../../assets/img/soundOFF-hover.svg";

const FullScreenButton = observer(class FullScreenButton extends Component {

    state = {isFullScreen: false};

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
        if (!this.state.isFullScreen) {
            this.setState({isFullScreen: true});
            BABYLON.Tools.RequestFullscreen(document.documentElement);
        }
        else {
            this.setState({isFullScreen: false});
            BABYLON.Tools.ExitFullscreen();
        }
    };

    render() {
        let svg = this.state.isFullScreen?
            <React.Fragment>
                <img className="svgButton__main" src={fullscreenClose} alt="fullscreen"/>
                <img className="svgButton__hover" src={fullscreenCloseHover} alt="fullscreen"/>
            </React.Fragment>:
            <React.Fragment>
                <img className="svgButton__main" src={fullscreen} alt="fullscreen"/>
                <img className="svgButton__hover" src={fullscreenHover} alt="fullscreen"/>
            </React.Fragment>;


        return (
            <button className="fullscreenButton svgButton" onClick={this.switchFullscreen}>
                {svg}
            </button>
        )
    }
});

export default FullScreenButton;
