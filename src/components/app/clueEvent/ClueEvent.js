import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_clueEvent.scss";
import SpaceBar from "../spacebar/Spacebar";

const ClueEvent = observer(class ClueEvent extends Component {

    render() {
        return (
            <div className="clueEvent">
                <p> Oooh tu as déclenché un évènement ;) </p>
                <SpaceBar onSpaceUp={() => this.props.closeClueEvent()}/>
            </div>
        )
    }
});

export default ClueEvent;