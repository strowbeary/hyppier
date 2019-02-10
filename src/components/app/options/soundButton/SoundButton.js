import React from 'react';
import {Component} from 'react';
import {observer} from "mobx-react";
import soundON from "../../../../assets/img/soundON.svg";
import soundONHover from "../../../../assets/img/soundON-hover.svg";
import soundOFF from "../../../../assets/img/soundOFF.svg";
import soundOFFHover from "../../../../assets/img/soundOFF-hover.svg";

const SoundButton = observer(class SoundButton extends Component {

    state = {on: true};

    constructor(props) {
        super(props);
        this.soundManager = props.soundManager;
    }

    toggleSound() {
        if (this.state.on) {
            this.soundManager.setGlobalVolume(0);
        } else {
            this.soundManager.setGlobalVolume(1);
        }
        this.setState({
            on: !this.state.on
        });


    };

    render() {
        let svg = this.state.on?
            <React.Fragment>
                <img src={soundON} alt="soundOn"/>
                <img src={soundONHover} alt="soundOnHover"/>
            </React.Fragment>:
            <React.Fragment>
                <img src={soundOFF} alt="soundOff"/>
                <img src={soundOFFHover} alt="soundOffHover"/>
            </React.Fragment>;

        return (
            <button className="soundButton" onClick={() => this.toggleSound()}>
                {svg}
            </button>
        )
    }
});

export default SoundButton;
