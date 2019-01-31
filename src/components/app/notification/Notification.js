import React, {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import {onPatch} from "mobx-state-tree";
import TimerStore from "../../../stores/TimerStore/TimerStore";
import PopupStore from "../../../stores/PopupStore/PopupStore";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

const Notification = observer(class Notification extends Component {

    constructor(props) {
        super(props);
        this.delayTimer = TimerStore.create(props.objectKind.objectTimeout);
        this.timer = TimerStore.create(props.objectKind.objectTimeout);
        this.path = [...CatalogStore.findobjectKindPath(props.objectKind.name), props.objectKind.activeObject + 1];
        onPatch(this.delayTimer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                this.timer.start();
            }
        });
        onPatch(this.timer, patch => {
            if (patch.op === "replace" && patch.path === "/ended" && patch.value === true) {
                PopupStore.firstPosition.setPosition(props.position);
                PopupStore.addPopup(this.path);
            }
        });
        this.startDelayTimer();
    }

    startDelayTimer() {
        this.delayTimer.start();
    }

    buildCatalog() {
        this.timer.stop();
        this.props.buildCatalog();
    }

    render() {
        const dashSize = Math.PI * 60;
        let hide = this.timer.running? '': 'hide';

        return (
            <div className={`notification ${hide} ${(this.timer.running && (this.timer.elapsedTime / this.timer.duration > 0.5)) ? "animated" : ""}`} onClick={() => this.buildCatalog()}>
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
