import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_startScreen.scss";
import SpaceBar from "../spacebar/Spacebar";

import objects from "../../../assets/img/objects.png";
import objectsBlurred from "../../../assets/img/objects-blurred.png";

const StartScreen = observer(class StartScreen extends Component {

    render() {
        return (
            <div className="startScreen">
                <img src={objects} alt="decoObjects" className="decoObjects"/>
                <img src={objectsBlurred} alt="decoObjectsBlurred" className="decoObjectsBlurred"/>
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
