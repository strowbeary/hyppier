import React, {Component} from "react";
import {observer} from "mobx-react";
import {createTimer, TimerManager} from "../../../utils/TimerManager";
import GameStore from "../../../stores/GameStore/GameStore";
import Toast from "./toast/Toast";
import {CSSTransitionGroup} from "react-transition-group";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const ToastWrapper = observer(class ToastWrapper extends Component {

    state = {toast: false};

    constructor(props) {
        super(props);
        this.timer = createTimer(3000);
        TimerManager.setTimerException(this.timer.timerId);
        this.timer.start();
        this.timer.onFinish(() => {
            if (this.state.toast) {
                this.setState({toast: false});
                let random = Math.round(Math.random() * 3000 + 500);
                this.timer.setDuration(random);
                this.timer.stop();
                this.timer.start();
            } else {
                this.setState({toast: true});
                this.timer.setDuration(3000);
                this.timer.stop();
                this.timer.start();
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.state.toast && (!GameStore.options.isPaused || (GameStore.options.isPaused && CatalogStore.isOpen)) &&
                        <Toast></Toast>
                    }
                </CSSTransitionGroup>
            </React.Fragment>
        )
    }
});

export default ToastWrapper;