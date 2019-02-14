import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_message.scss";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import {SoundManagerInstance} from "../GameCanvas/SoundManager";

const Message = observer(class Message extends Component {

    constructor(props){
        super(props);
        this.message = props.message;
        this.state = {message: ""};
    }

    componentDidMount() {
        if(this.message.action === "timer") {
            setTimeout(() => {
                TutoStore.reportAction("Attic", "actioned");
            }, this.message.expiration);
        }
        if(this.message.action === "keypress") {
            this.hideSpaceForListener = (e) => {this.hideSpace(e)};
            this.dispatchEventForListener = (e) => {this.dispatchEvent(e)};
            window.addEventListener("keydown", this.hideSpaceForListener);
            window.addEventListener("keyup", this.dispatchEventForListener);
        }
    }

    componentWillUnmount() {
        if(this.message.action === "keypress") {
            window.removeEventListener("keydown", this.hideSpaceForListener);
            window.removeEventListener("keyup", this.dispatchEventForListener);
        }
    }

    hideSpace(e) {
        if(e.keyCode === 32 || e.type === "click") {
            SoundManagerInstance && SoundManagerInstance.spacePress.play();
            this.setState({show: false})
        }
    }

    dispatchEvent(e) {
        if(e.keyCode === 32 || e.type === "click") {
            this.onSpaceUp();
        }
    }

    onSpaceUp() {
        TutoStore.reportAction(this.message.originTarget, "actioned");
        setTimeout(() => {
            if (TutoStore.currentMessage === 0) {
                TutoStore.reportAction("Intro", "appear");
            } else if (TutoStore.currentMessage === 1) {
                TutoStore.reportAction("EmptySpace", "appear");
            } else {
                TutoStore.reportAction("Notification", "appear");
            }
        }, 500);
    }

    render() {
        let arrow = this.message.action === "keypress"? 'withSpacebar' : '';

        return (
            <React.Fragment>
                <div className="message">
                    <p className={`message__typing ${arrow}`}>{this.message.text}</p>
                    {
                        this.message.action === "keypress" &&
                        <div className={`spacebar`} onClick={(e) => this.dispatchEventForListener(e)}>
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
});

export default Message;
