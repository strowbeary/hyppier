import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";
import {CSSTransitionGroup} from "react-transition-group";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import Message from "./message/Message"
import HypeIndicator from "./hypeIndicator/HypeIndicator"
import Toast from "./toast/Toast";
import TimerStore from "../../stores/TimerStore/TimerStore";
import {onPatch} from "mobx-state-tree";

const App = observer(class App extends Component {

    state = {message: null, toast: false};

    constructor(props) {
        super(props);
        this.timer = TimerStore.create(3000);
        this.timer.start();
        onPatch(this.timer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                if (this.state.toast) {
                    this.setState({toast: false});
                    let random = Math.round(Math.random() * 3000 + 500);
                    this.timer.setDuration(random);
                    this.timer.stop();
                    this.timer.start();
                } else {
                    this.setState({toast: true});
                    this.timer.setDuration(3000);
                    this.timer.stop();
                    this.timer.start();
                }
            }
        });
    }

    componentDidMount() {
        this.setState({message: "Tu peux désormais accéder à ton grenier."});
    }

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject + 1, 0);
        }
    }

    render() {
        return (
            <div id="app">
                <GameCanvas/>
                <HypeIndicator/>
                {/*{this.state.message &&
                    <Message message={this.state.message}/>
                }
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.state.toast &&
                        <Toast></Toast>
                    }
                </CSSTransitionGroup>*/}
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {CatalogStore.isOpen &&
                        <Catalog index={CatalogStore.objectKindIndex}/>
                    }
                </CSSTransitionGroup>
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
