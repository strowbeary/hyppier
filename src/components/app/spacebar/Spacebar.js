import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_spacebar.scss";
import {SoundManagerInstance} from "../GameCanvas/SoundManager";

const Spacebar = observer(class Spacebar extends Component {

    state = {show: true};

    constructor(props) {
        super(props);
        this.hideSpaceForListener = (e) => {this.hideSpace(e)};
        this.dispatchEventForListener = (e) => {this.dispatchEvent(e)};
    }

    componentDidMount() {
        window.addEventListener("keydown", this.hideSpaceForListener);
        window.addEventListener("keyup", this.dispatchEventForListener);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.hideSpaceForListener);
        window.removeEventListener("keyup", this.dispatchEventForListener);
    }

    hideSpace(e) {
        if(e.keyCode === 32 || e.type === "click") {
            SoundManagerInstance && SoundManagerInstance.spacePress.play();
            this.setState({show: false})
        }
    }

    dispatchEvent(e) {
        if(e.keyCode === 32 || e.type === "click") {
            this.props.onSpaceUp();
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.show &&
                    <div className="spacebar" onClick={(e) => this.dispatchEventForListener(e)}>
                        <span className="spacebar__spacebutton">Espace</span>
                    </div>
                }
            </React.Fragment>
        )
    }
});

export default Spacebar;
