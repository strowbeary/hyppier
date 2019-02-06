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
        this.delayTimer.onFinish(() => {
            TutoStore.reportAction("Notification", "appear");
            this.timer.unlock();
            this.timer.start();
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
            this.delayTimer.start();
        }
    }

    componentWillUnmount() {
        this.delayTimer.destroy();
        this.timer.destroy();
    }

    changeDelayTimer(fromValidate) {
        if (fromValidate) {
            this.delayTimer.setDuration(this.props.objectKind.objectTimeout);
        } else {
            this.delayTimer.setDuration(this.props.objectKind.objectTimeout/2);
        }
    }

    restartTimer() {
        this.delayTimer.stop();
        this.timer.stop();
        this.timer.lock();
        return this.timer.timerId;
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
        this.props.buildCatalog(this.timer);
        TutoStore.reportAction("Notification", "actionned");
    }

    render() {
        const dashSize = Math.PI * 60;
        let hide = this.state.running? '': 'hide';


        return (
            <div className={`notification ${hide} ${(this.state.running && (this.state.elapsedTime / this.duration > 0.5)) ? "animated" : ""}`} onClick={() => this.buildCatalog()}>
                <svg height={32} width={32}>
                    <circle cx={15} cy={15} r={14.25} stroke="black" strokeWidth="2" fill="transparent"
                            strokeDashoffset={this.state.elapsedTime / this.duration * -dashSize}
                            strokeDasharray={dashSize}/>
                    <circle cx={15} cy={15} r={9.25} fill="black"/>
                </svg>
            </div>
        )
    }
});


export default Notification;
