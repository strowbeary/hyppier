import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";

const HypeIndicator = observer(class HypeIndicator extends Component {

    render() {
        let style = {
          backgroundPositionY: `${GameStore.hype.level * 200}px`
        };

        return (
           <div className="hypeIndicator">
               <div className="hypeIndicator__level" style={style}></div>
           </div>
        )
    }
});

export default HypeIndicator;