import React, {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import {createTimer} from "../../../../utils/TimerManager"
import TutoStore from "../../../../stores/TutoStore/TutoStore";
import GameStore from "../../../../stores/GameStore/GameStore";

const Notification = observer(class Notification extends Component {

    state = {
        elapsedTime: 0,
        running: false
    };

    constructor(props) {
        super(props);
        this.duration = props.objectKind.objectTimeout;
        this.delayTimer = createTimer(this.duration);
        this.timer = createTimer(this.duration);
        this.timer.lock();
        this.playSound = props.playSound;
        this.delayTimer.onFinish(() => {
            this.timer.unlock();
            this.timer.start();
            this.playSound();
            this.setState({
                running: true
            });
            props.objectKind.objects[props.objectKind.activeObject].getModel().launchMaterialDegradation();
        });
        this.timer.addLoopHook((data) => {
            this.setState({
                elapsedTime: data.elapsedTime,
                running: data.running
            });
        });
        this.timer.onFinish(() => {
            this.setState({
                running: false
            });
            this.openPopup();
        });
        if (!GameStore.options.isPaused) {
            this.delayTimer.setDuration(Math.round(this.duration / (Math.random() + 1)));
            this.delayTimer.start();
        }
    }

    componentWillUnmount() {
        this.delayTimer.destroy();
        this.timer.destroy();
    }

    changeDelayTimer(fromValidate) {
        if (fromValidate) {
            this.delayTimer.setDuration(this.duration);
        } else {
            this.delayTimer.setDuration(this.duration / 2);
        }
    }

    restartTimer() {
        this.delayTimer.stop();
        this.timer.stop();
        this.timer.lock();
    }

    openPopup() {
        this.props.openPopup();
    }

    buildCatalog() {
        this.timer.stop();
        this.timer.lock();
        this.setState({
            running: false
        });
        this.props.buildCatalog();
        TutoStore.reportAction("Notification", "actioned");
    }

    render() {
        const dashSize = Math.PI * 60;
        let hide = this.state.running ? '' : 'hide';
        let glow = (this.state.running && (this.state.elapsedTime / this.timer.getDuration() > 0.5)) ? "glow" : "";

        return (
            <div className={`notification ${hide}`} onClick={() => this.buildCatalog()}>
                <div className={`wrapper ${glow}`}>
                    <span>+</span>
                </div>
                <svg height={40} width={40}>
                    <circle cx={20} cy={20} r={18} stroke="black" strokeWidth="2" fill="transparent"
                            strokeDashoffset={this.state.elapsedTime / this.timer.getDuration() * -dashSize}
                            strokeDasharray={dashSize}/>
                </svg>


            </div>
        )
    }
});


export default Notification;
