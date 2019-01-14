import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_message.scss";

const Message = observer(class Message extends Component {

    constructor(props){
        super(props);
        this.message = props.message;
        this.state = {message: "", typingEnd: false};
    }

    componentDidMount() {
        this.typeWriter();
    }

    typeWriter(i = 0) {
        if (i < this.message.length) {
            let currentMessage = this.state.message;
            this.setState({message: currentMessage += this.message[i]});
            i++;
            setTimeout(() => {this.typeWriter(i)}, 50);
        } else {
            this.setState({typingEnd: true});
        }
    }

    render() {
        let arrow = this.state.typingEnd? 'arrow':'';

        return (
            <div className="message">
                <p className={arrow}>{this.state.message}</p>
            </div>
        )
    }
});

export default Message;