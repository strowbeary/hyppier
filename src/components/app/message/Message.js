import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_message.scss";
import {TimerManager} from "../../../utils/TimerManager";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import * as GameManager from "../../../GameManager";
import SpaceBar from "../spacebar/Spacebar";

const Message = observer(class Message extends Component {

    constructor(props){
        super(props);
        this.message = props.message;
        this.state = {message: "", typingEnd: false};
        this.skiped = false;
        this.skipTypeWriterForListener = (e) => {this.skipTypeWriter(e)};
        window.addEventListener("keyup", this.skipTypeWriterForListener);
    }

    componentDidMount() {
        this.typeWriter();
    }
    componentWillUnmount() {
    }

    skipTypeWriter(e) {
        if (e.keyCode === 32) {
            this.skiped = true;
        }
    }

    onTypingEnd() {
        this.setState({typingEnd: true});
        if(this.message.action === "timer") {
            setTimeout(() => {
                TutoStore.hideTip();
            }, this.message.expiration);
        }
    }

    typeWriter(i = 0) {
        if (!this.skiped) {
            if (i < this.message.text.length) {
                let currentMessage = this.state.message;
                this.setState({message: currentMessage += this.message.text[i]});
                i++;
                setTimeout(() => {this.typeWriter(i)}, 35);
            } else {
                this.onTypingEnd();
            }
        } else {
            this.setState({message: this.message.text});
            window.removeEventListener("keyup", this.skipTypeWriterForListener);
            this.onTypingEnd();
        }
    }

    onSpaceUp() {
        TutoStore.reportAction("Intro", "actioned");
        setTimeout(() => {
            if (TutoStore.currentMessage === 0) {
                TutoStore.reportAction("Intro", "appear");
            } else {
                TutoStore.reportAction("EmptySpace", "appear");
            }
        }, 500);
    }

    render() {
        let arrow = this.state.typingEnd? (this.message.action === "keypress"? 'arrow' : 'end') : '';

        return (
            <React.Fragment>
                <div className="message">
                    <p className={`message__typing ${arrow}`}>{this.state.message}</p>
                    <p className={"message__placeholder"}>{this.message.text}</p>
                </div>
                {
                    this.state.typingEnd && this.message.action === "keypress" &&
                        <SpaceBar onSpaceUp={() => this.onSpaceUp()}/>
                }
            </React.Fragment>
        )
    }
});

export default Message;
