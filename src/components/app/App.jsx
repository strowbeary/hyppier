import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";

import WebglRoot from "./3dScene/WebglRoot"
import FullScreenMode from "./options/FullScreenButton"

const App = observer(class App extends Component {

    webGLRoot = React.createRef();

    resizeWebGLRoot = ()  => {
        this.webGLRoot.current.changeSceneLimits();
    };

    render() {
        return (
            <div id="app">
                <WebglRoot ref={this.webGLRoot} />
                <FullScreenMode onClick={this.resizeWebGLRoot}/>
            </div>
        )
    }
});

export default App;
