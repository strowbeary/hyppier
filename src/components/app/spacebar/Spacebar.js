import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_spacebar.scss";

const Spacebar = observer(class Spacebar extends Component {

    render() {
        return (
            <div className="spacebar">
                <span className="spacebar__spacebutton">Espace</span>
            </div>
        )
    }
});

export default Spacebar;