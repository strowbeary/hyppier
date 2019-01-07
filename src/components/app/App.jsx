import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";

import WebglRoot from "./3dScene/WebglRoot"
import FullScreenButton from "./options/FullScreenButton"

const App = observer(class App extends Component {

    render() {
        return (
            <div id="app">
                <WebglRoot />
                <FullScreenButton/>
            </div>
        )
    }
});

export default App;
