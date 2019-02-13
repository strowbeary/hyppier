import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas/GameCanvas";
import {CSSTransitionGroup} from "react-transition-group";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import HypeIndicator from "./hypeIndicator/HypeIndicator"
import ToastWrapper from "./toastWrapper/ToastWrapper";
import GameStore from "../../stores/GameStore/GameStore";
import ClueEvent from "./clueEvent/ClueEvent";
import StartScreen from "./startScreen/StartScreen";
import TutoStore from "../../stores/TutoStore/TutoStore";
import pauseSvg from "../../assets/img/pause.svg";
import GoodEndScreen from "./goodEndScreen/GoodEndScreen";

const App = observer(class App extends Component {

    state = {
        message: null,
        loading: false,
        ready: false
    };

    resetPipo() {
        GameStore.setPipo("");
    }

    launchLoading() {
        this.setState({
            loading: true
        });
    }

    updateReady(sceneManager) {
        this.setState({
            ready: true,
            sceneManager: sceneManager
        });
    }

    render() {
        let isAtticVisible = GameStore.attic.atticVisible ? 'attic' : '';
        let badEnding = GameStore.attic.isGameOver()? 'badEnding': '';
        let pipoMood = "";
        if (GameStore.pipo === 'happy') {
            pipoMood = "happy";
            setTimeout(() => this.resetPipo(), 2970);
        }
        if (GameStore.pipo === 'angry') {
            pipoMood = "angry";
            setTimeout(() => this.resetPipo(), 2970);
        }

        return (
            <div id="app" className={`${pipoMood} ${isAtticVisible} ${badEnding}`}
                 ref={(ref) => this.app = ref}>
                {!this.state.ready &&
                    <StartScreen launchLoading={() => {this.launchLoading()}}/>
                    //<GoodEndScreen/>
                }
                {this.state.loading &&
                    <GameCanvas onReady={(sceneManager) => this.updateReady(sceneManager)}/>
                }
                {this.state.loading && !GameStore.attic.atticVisible &&
                    <HypeIndicator/>
                }
                {
                    this.state.loading && GameStore.attic.atticVisible &&
                    <img src={pauseSvg} alt="pause" className={"pause"}/>
                }
                <div className={"catalogWrapper"}>
                    <CSSTransitionGroup
                        transitionName="catalog"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        {CatalogStore.isOpen &&
                        <Catalog index={CatalogStore.objectKindIndex}/>
                        }
                    </CSSTransitionGroup>
                </div>
                {
                    TutoStore.end &&
                    <ToastWrapper/>
                }
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {GameStore.clueEvent && this.state.sceneManager &&
                    <ClueEvent clueEventType={GameStore.clueEvent} sceneManager={this.state.sceneManager}/>
                    }
                </CSSTransitionGroup>
            </div>
        )
    }
});

export default App;
