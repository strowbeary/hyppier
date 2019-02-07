import React, {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";
import TutoStore from "../../../../stores/TutoStore/TutoStore";

export default observer(class EmptySpace extends Component {

    clickHandler() {
        this.props.buildCatalog();
        TutoStore.reportAction("EmptySpace", "actioned");
    }

    render() {
        let glow = TutoStore.getCurrentMessage().originTarget === "EmptySpace"? 'glow': '';

        return (
            <div className={`emptySpace`} onClick={() => this.clickHandler()}>
                <div className={`emptySpace__wrapper ${glow}`}>
                    <span>+</span>
                </div>
            </div>
        )
    }
});
