import React from 'react';
import {Component} from 'react';
import "./_fullscreenbutton.scss";
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";

const FullScreenButton = observer(class FullScreenButton extends Component {

    constructor(props) {
        super(props);
    }

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
        this.props.onClick();
    };

    render() {
        return (
            <button className="fullscreenbutton" onClick={this.switchFullscreen}>FULL SCREEN</button>
        )
    }
});

export default FullScreenButton;
