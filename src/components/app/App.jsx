import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import ThreeContainer from "./threeContainer/ThreeContainer";
import {TimeManager} from "../../TimeManager";

const App = {
    displayName: "App",
    componentDidMount() {
        console.log("App mounted !");
    },
    render() {
        const timer = TimeManager
            .create(1000*6);
        timer.addEventListener("timeout", () => console.log("toto"));
        return (
            <div id="app">
                <p>{timer.currentTimeout}</p>
                <button onClick={() => {
                    timer.start();
                    console.log(timer, timer.currentTimeout);
                }}>Start</button>
                <button onClick={() => {
                    console.log(timer, timer.currentTimeout);
                    timer.pause();
                    console.log(timer, timer.currentTimeout);
                }}>Pause</button>
            </div>
        )
    }
};

export default observer(createReactClass(App));
