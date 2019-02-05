import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_startScreen.scss";
import SpaceBar from "../spacebar/Spacebar";

import sound_catEars from "./img/sound_catEars.png"
import sound_headset from "./img/sound_headset.png"
import sound_iPod from "./img/sound_iPod.png"

const StartScreen = observer(class StartScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="startScreen">
                <img src={sound_catEars} alt={"deco"} className={"catEars"}/>
                <img src={sound_headset} alt={"deco"} className={"headset"}/>
                <img src={sound_iPod} alt={"deco"} className={"iPod"}/>
                <img src={sound_headset} alt={"deco"} className={"blur_headset"}/>
                <div className="startScreen__wrapper">
                    <div className={"startScreen__text"}>
                        <h1 className="startScreen__title">Hyppier</h1>
                        <p className="startScreen__baseline">Et si la hype faisait le bonheur ?</p>
                    </div>
                </div>
                <SpaceBar onSpaceUp={() => this.props.launchLoading()}/>
            </div>
        )
    }
});

export default StartScreen;