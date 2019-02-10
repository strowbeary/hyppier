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
                <p> Oooh tu as déclenché un évènement ;) </p>
                <SpaceBar onSpaceUp={() => this.closeClueEvent()}/>
            </div>
        )
    }
});

export default ClueEvent;
