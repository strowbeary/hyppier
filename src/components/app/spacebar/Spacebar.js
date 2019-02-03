import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_spacebar.scss";

const Spacebar = observer(class Spacebar extends Component {

    componentDidMount() {
        window.addEventListener("keyup", (e) => {this.dispatchEvent(e)});
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", (e) => {this.dispatchEvent(e)});
    }

    dispatchEvent(e) {
        e.preventDefault();
        e.keyCode === 32 && this.props.onSpaceUp();
    }

    render() {
        return (
            <div className="spacebar">
                <span className="spacebar__spacebutton">Espace</span>
            </div>
        )
    }
});

export default Spacebar;