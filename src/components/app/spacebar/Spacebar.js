import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_spacebar.scss";

const Spacebar = observer(class Spacebar extends Component {

    render() {
        return (
            <div className="spacebar">
                <span className="spacebar__arrow">↓</span>
                <span className="spacebar__spacebutton">Espace</span>
                <span className="spacebar__arrow">↓</span>
            </div>
        )
    }
});

export default Spacebar;