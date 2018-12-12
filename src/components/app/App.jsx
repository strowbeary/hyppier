import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";

import BabylonPlayground from "./babylonPlayground/babylonPlayground"

const App = {
    displayName: "App",
    componentDidMount() {
    },
    render() {
        return (
            <div id="app">
                <BabylonPlayground/>
                {/*<Notification time={5000}/>
                <Notification time={5000}/>
                <Notification time={10000}/>
                <Notification time={15000}/>
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
                </div>*/}
            </div>
        )
    }
};

export default observer(createReactClass(App));
