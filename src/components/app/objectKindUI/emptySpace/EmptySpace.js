import React, {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";
import TutoStore from "../../../../stores/TutoStore/TutoStore";

export default observer(class EmptySpace extends Component {
    componentDidMount() {
        TutoStore.reportAction("EmptySpace", "appear");
    }

    clickHandler() {
        this.props.buildCatalog();
        TutoStore.reportAction("EmptySpace", "actionned")
    }

    render() {
        return (
            <div className={`emptySpace`} onClick={() => this.clickHandler()}>
                <div className="emptySpace__wrapper">
                    <span>+</span>
                </div>
            </div>
        )
    }
});
