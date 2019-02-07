import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_clueEvent.scss";
import SpaceBar from "../spacebar/Spacebar";
import {GameManager} from "../../../GameManager"

const ClueEvent = observer(class ClueEvent extends Component {

    constructor(props) {
        super(props);
        this.sceneManager = props.sceneManager;
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
