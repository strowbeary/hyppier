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
        e.preventDefault();
        e.stopPropagation();
        if(e.keyCode === 32) {
            SoundManagerInstance && SoundManagerInstance.spacePress.play();
            this.setState({show: false})
        }
    }

    dispatchEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        if(e.keyCode === 32) {
            this.props.onSpaceUp();
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.show &&
                    <div className="spacebar">
                        <span className="spacebar__spacebutton">Espace</span>
                    </div>
                }
            </React.Fragment>
        )
    }
});

export default Spacebar;