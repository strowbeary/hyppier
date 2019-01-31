import React, {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";

export default observer(class EmptySpace extends Component {

    render() {
        return (
            <div className={`emptySpace`}>
                <div className="emptySpace__wrapper">
                    <span>+</span>
                </div>
            </div>
        )
    }
});
