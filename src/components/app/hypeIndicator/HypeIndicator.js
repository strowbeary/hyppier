import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";

const HypeIndicator = observer(class HypeIndicator extends Component {

    render() {
        let style = {
          backgroundSize: `auto ${GameStore.hype.level * 100}%`
        };

        return (
           <div className="hypeIndicator">
               <span className="hypeIndicator__label" style={style}>Hype</span>
           </div>
        )
    }
});

export default HypeIndicator;