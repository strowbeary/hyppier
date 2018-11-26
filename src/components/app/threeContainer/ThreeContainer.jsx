import React from 'react';
import createReactClass from "create-react-class";
import "./_threeContainer.scss";
import {observer} from "mobx-react";
import threeEntryPoint from "../../../threeEntryPoint";

const ThreeContainer = {
    displayName: "ThreeContainer",
    componentDidMount() {
        threeEntryPoint(this.threeRootElement)
    },
    render() {
        return (
            <div id="threeContainer" ref={element => this.threeRootElement = element}>

            </div>
        )
    }
};

export default observer(createReactClass(ThreeContainer));
