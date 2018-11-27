import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import Notification from "./notification/Notification";
const App = {
    displayName: "App",
    componentDidMount() {
        console.log("App mounted !");
    },
    render() {
        return (
            <div id="app">
                <Notification time={5000}/>
            </div>
        )
    }
};

export default observer(createReactClass(App));
