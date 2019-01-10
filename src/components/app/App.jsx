import React, {Component} from 'react';
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";

const App = observer(class App extends Component {

    /*testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject[0] + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject[0] + 1, 0);
        }
        console.log(objectKindPath.toJSON())
    }*/

    render() {
        return (
            <div id="app">
                <GameCanvas/>
            </div>
        )
    }
});

export default App;
