import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import SvgButton from "../../svgButton/SvgButton";

const SoundButton = observer(class SoundButton extends Component {

    state = {on: true};

    toggleSound() {
        this.setState({
            on: !this.state.on
        });
    };

    render() {
        let svg = this.state.on? <SvgButton type={"soundOn"}/> : <SvgButton type={"soundOff"}/>;

        return (
            <button className={"soundButton"} onClick={() => this.toggleSound()}>
                {svg}
            </button>
        )
    }
});

export default SoundButton;
