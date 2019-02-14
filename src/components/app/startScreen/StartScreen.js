import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_startScreen.scss";
import SpaceBar from "../spacebar/Spacebar";

const StartScreen = observer(class StartScreen extends Component {
    state = {
        x: 0
    };

    componentDidMount() {
        this.mousemove = (e) => {
            this.setState({
                x: (e.clientX / window.innerWidth - 0.5)
            });
        };
        document.addEventListener("mousemove", this.mousemove);
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this.mousemove);
    }

    render() {
        return (
            <div className="startScreen" style={{
                backgroundPositionX: `${this.state.x * 20}vw, ${this.state.x * 10}vw`
            }}>
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
