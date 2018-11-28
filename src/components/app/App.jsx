import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import Notification from "./notification/Notification";
import TimeManager from "../../utils/TimeManager";
import GlobalGameStore from "../../stores/globalGameStore";
const App = {
    displayName: "App",
    componentDidMount() {
        console.log("GlobalGameStore");
    },
    render() {
        return (
            <div id="app">
                <Notification time={5000}/>
                <Notification time={5000}/>
                <Notification time={5000}/>
                <div>
                    <button onClick={() => {
                        TimeManager.startAll();
                    }}>Start</button>
                    <button onClick={() => {
                        TimeManager.pauseAll();
                    }}>Pause</button>
                    <button onClick={() => {
                        TimeManager.stopAll();
                    }}>Stop</button>
                </div>
            </div>
        )
    }
};

export default observer(createReactClass(App));
