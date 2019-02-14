import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas/GameCanvas";

const App = observer(class App extends Component {

    state = {
        message: null,
        loading: false,
        ready: false
    };


    updateReady(sceneManager) {
        this.setState({
            ready: true,
            sceneManager: sceneManager
        });
    }

    render() {

        return (
            <div id="app">

                    <GameCanvas onReady={(sceneManager) => this.updateReady(sceneManager)}/>

            </div>
        )
    }
});

export default App;
