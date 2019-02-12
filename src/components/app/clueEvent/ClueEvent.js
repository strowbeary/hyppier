import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_clueEvent.scss";
import SpaceBar from "../spacebar/Spacebar";
import {SoundManagerInstance} from "../GameCanvas/SoundManager";

const ClueEvent = observer(class ClueEvent extends Component {

    constructor(props) {
        super(props);
        this.sceneManager = props.sceneManager;
        this.type = props.clueEventType;
    }

    componentDidMount() {
        if (this.type === "electric") {
            SoundManagerInstance.clueEventElectric.play();
        }
    }

    closeClueEvent() {
        this.sceneManager.gameManager.playAfterClueEvent();
    }

    componentWillUnmount() {
        this.sceneManager.gameManager.playAfterClueEventClosed()
    }

    render() {
        return (
            <div className="clueEvent">
                {this.type === "electric" &&
                    <div className="clueEvent__wrapper">
                        <h3 className="clueEvent__title">Boom!</h3>
                        <p>Tu t’es lâché.e sur le nombre d’appareils électroniques, les plombs ont sauté…</p>
                        <p>Retire un objet gourmand en énergie en appuyant sur espace</p>
                    </div>
                }
                <SpaceBar onSpaceUp={() => this.closeClueEvent()} color={"white"}/>
            </div>
        )
    }
});

export default ClueEvent;
