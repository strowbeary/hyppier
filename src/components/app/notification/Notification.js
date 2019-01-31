import React, {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import {onPatch} from "mobx-state-tree";
import TimerStore from "../../../stores/TimerStore/TimerStore";
import PopupStore from "../../../stores/PopupStore/PopupStore";

const Notification = observer(class Notification extends Component {

    constructor(props) {
        super(props);
        this.timer = TimerStore.create(props.objectKind.objectTimeout);
        //this.timer.start();
        onPatch(this.timer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                PopupStore.addPopup(this.path);
            }
        });
    }

    buildCatalog() {
        this.timer.stop();
        this.props.buildCatalog();
    }

    render() {
        const dashSize = Math.PI * 60;

        return (
            <div className={`notification ${(this.timer.running && (this.timer.elapsedTime / this.timer.duration > 0.5)) ? "animated" : ""}`} onClick={() => this.buildCatalog()}>
                <svg height={32} width={32}>
                    <circle cx={15} cy={15} r={14.25} stroke="black" strokeWidth="2" fill="transparent"
                            strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                            strokeDasharray={dashSize}/>
                    <circle cx={15} cy={15} r={9.25} fill="black"/>
                </svg>
            </div>
        )
    }
});


export default Notification;
