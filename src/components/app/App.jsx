import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";
import ThreeContainer from "./threeContainer/ThreeContainer";
const App = {
    displayName: "App",
    componentDidMount() {
        console.log("App mounted !");
    },
    render() {
        return (
            <div id="app">
                <ThreeContainer/>
            </div>
        )
    }
};

export default observer(createReactClass(App));
