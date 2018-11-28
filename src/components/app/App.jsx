import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import Notification from "./notification/Notification";
import TimerStore from "../../stores/TimerStore/TimerStore";
const App = {
    displayName: "App",
    componentDidMount() {

    },
    render() {
        return (
            <div id="app">
                <Notification time={5000}/>
                <Notification time={5000}/>
                <Notification time={5000}/>
                <div>
                    <button onClick={() => {
                        TimerStore.startAll();
                    }}>Start</button>
                    <button onClick={() => {
                        TimerStore.pauseAll();
                    }}>Pause</button>
                    <button onClick={() => {
                        TimerStore.stopAll();
                    }}>Stop</button>
                </div>
            </div>
        )
    }
};

export default observer(createReactClass(App));
