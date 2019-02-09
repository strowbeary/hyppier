import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_message.scss";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import SpaceBar from "../spacebar/Spacebar";

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
        if(this.message.originTarget === "Attic") {
            this.props.launchLadderFall();
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
        let arrow = this.message.action === "keypress"? 'arrow' : 'end';

        return (
            <React.Fragment>
                <div className="message">
                    <p className={`message__typing ${arrow}`}>{this.message.text}</p>
                    <p className={"message__placeholder"}>{this.message.text}</p>
                </div>
                {
                    this.message.action === "keypress" &&
                        <SpaceBar onSpaceUp={() => this.onSpaceUp()}/>
                }
            </React.Fragment>
        )
    }
});

export default Message;
