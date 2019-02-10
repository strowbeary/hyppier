import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_startScreen.scss";
import SpaceBar from "../spacebar/Spacebar";

import objects from "../../../assets/img/objects.png";
import objectsBlurred from "../../../assets/img/objects-blurred.png";

const StartScreen = observer(class StartScreen extends Component {
    state = {
        x: 0
    };
    componentDidMount() {
        this.mousemove = document.addEventListener("mousemove", (e) => {
            this.setState({
                x: (e.clientX / window.innerWidth - 0.5)
            });
        })
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this.mousemove);
    }

    render() {
        return (
            <div className="startScreen">
                <img src={objects} alt="decoObjects" className="decoObjects" style={{
                    left: `${this.state.x * 100}px`
                }}/>
                <img src={objectsBlurred} alt="decoObjectsBlurred" className="decoObjectsBlurred" style={{
                    left: `${this.state.x * 200}px`
                }}/>
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
