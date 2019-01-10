import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";
//import WebglRoot from "./3dScene/WebglRoot"
//import FullScreenButton from "./options/FullScreenButton"
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"

const App = observer(class App extends Component {

    webGLRoot = React.createRef();
    state = {catalogShow: true};

    resizeWebGLRoot() {
        this.webGLRoot.current.changeSceneLimits();
    };

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject[0] + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject[0] + 1, 0);
        }
        console.log(objectKindPath.toJSON())
    }

    onClose() {
        this.setState({catalogShow: false});
    }

    render() {
        return (
            <div id="app">
                {this.state.catalogShow &&
                    <Catalog path={[0, 0, 1]} onClose={() => this.onClose()}/>
                }
                {/*<WebglRoot ref={this.webGLRoot} />
                <div  style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0
                }}>
                    <FullScreenButton onClick={() => this.resizeWebGLRoot()}/>
                    <button onClick={() => this.testChangeObject()} >Test change</button>
                </div>*/}
            </div>
        )
    }
});

export default App;
