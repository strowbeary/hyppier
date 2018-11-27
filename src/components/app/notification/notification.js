import React from 'react';
import createReactClass from "create-react-class";
import "./_notification.scss";
import {observer} from "mobx-react";
import {TimeManager} from "../../utils/TimeManager";

const App = {
    displayName: "App",
    state: {
        toto: false
    },
    componentDidMount() {
        this.setState({toto: true})
    },
    render() {
        return (
            <div className="notification">

            </div>
        )
    }
};

export default observer(createReactClass(App));
