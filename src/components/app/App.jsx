import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import ThreeContainer from "./threeContainer/ThreeContainer";
import {TimeManager} from "../../utils/TimeManager";

const App = {
    displayName: "App",
    componentDidMount() {
        console.log("App mounted !");
    },
    render() {
        const timer = TimeManager
            .create(3000);
        timer.addEventListener("timeout", () => console.log("END: ", timer, timer.elapsedTime));
        return (
            <div id="app">
                <button onClick={() => {
                    timer.start();
                    console.log(timer, timer.elapsedTime);
                }}>Start</button>
                <button onClick={() => {
                    timer.pause();
                    console.log(timer, timer.elapsedTime);
                }}>Pause</button>
                <button onClick={() => {
                    timer.reset();
                    console.log(timer, timer.elapsedTime);
                }}>Reset</button>
            </div>
        )
    }
};

export default observer(createReactClass(App));
