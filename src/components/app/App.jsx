import React from 'react';
import createReactClass from "create-react-class";
import "./_app.scss";
import {observer} from "mobx-react";

import WebglRoot from "./3dScene/WebglRoot"

const App = {
    displayName: "App",
    componentDidMount() {
    },
    render() {
        return (
            <div id="app">
                <WebglRoot/>
            </div>
        )
    }
};

export default observer(createReactClass(App));
