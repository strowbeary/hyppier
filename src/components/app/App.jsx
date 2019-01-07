import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";

import WebglRoot from "./3dScene/WebglRoot"
import FullScreenButton from "./options/FullScreenButton"
import CatalogStore from "../../stores/CatalogStore/CatalogStore";

const App = observer(class App extends Component {

    webGLRoot = React.createRef();

    resizeWebGLRoot() {
        this.webGLRoot.current.changeSceneLimits();
    };

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        objectKindPath.setActiveObject(1, 0);
    }
    render() {
        return (
            <div id="app">
                <WebglRoot ref={this.webGLRoot} />
                <div  style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0
                }}>
                    <FullScreenButton onClick={() => this.resizeWebGLRoot()}/>
                    <button onClick={() => this.testChangeObject()} >Test change</button>
                </div>
            </div>
        )
    }
});

export default App;
