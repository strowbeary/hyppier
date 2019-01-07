import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";

import WebglRoot from "./3dScene/WebglRoot"
import FullScreenButton from "./options/FullScreenButton"

const App = observer(class App extends Component {

    webGLRoot = React.createRef();

    resizeWebGLRoot = ()  => {
        this.webGLRoot.current.changeSceneLimits();
    };

    render() {
        return (
            <div id="app">
<<<<<<< HEAD
                <WebglRoot/>
=======
                <WebglRoot ref={this.webGLRoot} />
                <FullScreenButton onClick={this.resizeWebGLRoot}/>
>>>>>>> 38c6fbf3b0dc30ac0be350d920de86faf2181e06
            </div>
        )
    }
});

export default App;
