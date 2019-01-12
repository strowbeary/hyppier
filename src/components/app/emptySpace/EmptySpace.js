import React from 'react';
import {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";
import CountdownStore from "../../../stores/TimerStore/TimerStore";

const EmptySpace = observer(class EmptySpace extends Component {

    timer = CountdownStore.create(5000);

    componentDidMount() {
        this.timer.start();
    }

    render() {
        let style;
        let styleWrapper;
        let scale = ((this.timer.elapsedTime * 0.75)/this.timer.duration) + 1;
        style = {
            transform: `scale(${scale})`
        };
        styleWrapper = {
            animationDuration: (this.timer.duration/this.timer.elapsedTime) * 100 +"ms"
        };

        return (
            <div className="emptySpace" style={style}>
                <div className="emptySpace__wrapper" style={styleWrapper}>
                    <span>+</span>
                </div>
            </div>
        )
    }
});

export default EmptySpace;