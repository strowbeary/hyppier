import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";
import {CSSTransitionGroup} from "react-transition-group";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import HypeIndicator from "./hypeIndicator/HypeIndicator"
import Toast from "./toast/Toast";
import {createTimer} from "../../utils/TimerManager";
import GameStore from "../../stores/GameStore/GameStore";
import ClueEvent from "./clueEvent/ClueEvent";
import Message from "./message/Message";
import StartScreen from "./startScreen/StartScreen";
import AboutModal from "./aboutModal/AboutModal";
import FullScreenButton from "./options/fullscreenButton/FullScreenButton";
import TutoStore from "../../stores/TutoStore/TutoStore";

const App = observer(class App extends Component {

    state = {message: null, toast: false, loading: false, ready: false};

    constructor(props) {
        super(props);
        /*this.timer = createTimer(3000);
        this.timer.start();
        this.timer.onFinish(() => {
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
        });*/
    }

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if (objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject + 1, 0);
        }
    }

    resetPipo() {
        if (GameStore.pipo === 'happy') {
            GameStore.setPipo("");
        }
    }

    launchLoading() {
        this.setState({
            loading: true
        });
    }

    updateReady() {
        this.setState({
            ready: true
        });
    }

    render() {
        let isAtticVisible = GameStore.attic.atticVisible ? 'attic' : '';
        let pipoMood = "";
        if(GameStore.pipo === 'happy') {
            pipoMood = "happy";
            setTimeout(() => this.resetPipo(), 3000);
        }

        return (
            <div id="app" className={`${pipoMood} ${isAtticVisible}`} onAnimationEnd={(e) => this.resetPipo(e)}
                 ref={(ref) => this.app = ref}>
                {!this.state.ready &&
                    <StartScreen launchLoading={() => {this.launchLoading()}}/>
                }
                {this.state.loading &&
                    <GameCanvas onReady={() => this.updateReady()}/>
                }
                {this.state.loading &&
                    <HypeIndicator/>
                }
                {this.state.loading &&
                    <div className={"game__footer"}>
                        <AboutModal/>
                        <FullScreenButton/>
                    </div>
                }
                {/*{this.state.message &&
                        <Message message={this.state.message}/>
                        }*/}
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.state.toast && !GameStore.options.isPaused &&
                    <Toast></Toast>
                    }
                </CSSTransitionGroup>
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {CatalogStore.isOpen &&
                    <Catalog index={CatalogStore.objectKindIndex}/>
                    }
                </CSSTransitionGroup>
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {GameStore.clueEvent &&
                    <ClueEvent clueEventType={GameStore.clueEvent}/>
                    }
                </CSSTransitionGroup>
            </div>
        )
    }
});

export default App;
