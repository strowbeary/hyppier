import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import TimeManager from "../../utils/TimeManager";

const timer = TimeManager.create(3000);
const App = {
    displayName: "App",
    componentDidMount() {
        console.log("App mounted !");
    },
    render() {
        return (
            <div id="app">
                <p>{timer.elapsedTime} / {timer.duration}</p>
                <button onClick={() => {
                    timer.start();
                }}>Start</button>
                <button onClick={() => {
                    timer.pause();
                }}>Pause</button>
                <button onClick={() => {
                    timer.reset();
                }}>Reset</button>
            </div>
        )
    }
};

export default observer(createReactClass(App));
