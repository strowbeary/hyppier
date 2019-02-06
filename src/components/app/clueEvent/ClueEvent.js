import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_clueEvent.scss";
import SpaceBar from "../spacebar/Spacebar";
import {GameManager} from "../../../GameManager"

const ClueEvent = observer(class ClueEvent extends Component {

    constructor(props) {
        super(props);
    }

    closeClueEvent() {
        GameManager.GameManager.playAfterClueEvent();
    }

    componentWillUnmount() {
        GameManager.GameManager.playAfterClueEventClosed()
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