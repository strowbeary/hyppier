import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_message.scss";
import {TimerManager} from "../../../utils/TimerManager";
import TutoStore from "../../../stores/TutoStore/TutoStore";
import * as GameManager from "../../../GameManager";

const Message = observer(class Message extends Component {

    constructor(props){
        super(props);
        this.message = props.message;
        this.state = {message: "", typingEnd: false};
    }

    componentDidMount() {
        this.typeWriter();
        if(this.message.action === "timer") {

            setTimeout(() => {
                TutoStore.hideTip();
            }, this.message.expiration);
        }
    }
    componentWillUnmount() {
    }

    typeWriter(i = 0) {
        if (i < this.message.text.length) {
            let currentMessage = this.state.message;
            this.setState({message: currentMessage += this.message.text[i]});
            i++;
            setTimeout(() => {this.typeWriter(i)}, 35);
        } else {
            this.setState({typingEnd: true});
        }
    }

    render() {
        let arrow = this.state.typingEnd ? 'arrow' : '';

        return (
            <div className="message">
                <p className={arrow}>{this.state.message}</p>
            </div>
        )
    }
});

export default Message;
