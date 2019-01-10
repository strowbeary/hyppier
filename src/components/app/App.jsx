import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";

const App = observer(class App extends Component {

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject[0] + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject[0] + 1, 0);
        }
    }

    render() {
        return (
            <div id="app">
                <GameCanvas/>
                <button style={{
                    position: "fixed",
                    bottom: 10,
                    right: 10
                }} onClick={() => this.testChangeObject()}>Change object</button>
            </div>
        )
    }
});

export default App;
