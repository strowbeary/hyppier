import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";

const HypeIndicator = observer(class HypeIndicator extends Component {

    render() {
        let style = {
          backgroundPositionY: `${200 - (200*GameStore.hype.level)}px`
        };

        return (
           <div className="gameIndicator">
               <div className="gameIndicator__wrapper">
                   <div className="gameIndicator__hypeLevel" style={style}></div>
                   <div className={`pipo ${GameStore.pipo}`}></div>
               </div>
           </div>
        )
    }
});

export default HypeIndicator;