import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";
import { CSSTransitionGroup } from "react-transition-group";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import Message from "./message/Message"
import Spacebar from "./spacebar/Spacebar"
import EmptySpace from "./emptySpace/EmptySpace"
import Notification from "./notification/Notification"
import Popup from "./popup/Popup"
import {NotificationsManager} from "../../stores/NotificationsManager";

const App = observer(class App extends Component {

    state = {catalogShow: false, message: null};

    componentDidMount() {
        this.setState({catalogShow: true, message: "Tu peux désormais accéder à ton grenier."});
        setTimeout(
            () => {
                this.setState({bob: Popup.createPopup({path: [0, 0, 0]})});
            }, 4000
        );
        setTimeout(
            () => {
                this.setState({popup: Popup.createPopup({path: [0, 0, 1]})});
            }, 5000
        )
    }


    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject[0] + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject[0] + 1, 0);
        }
    }

    onClose() {
        this.setState({catalogShow: false});
    }

    render() {

        return (
            <div id="app">
                <GameCanvas/>

                {/*<CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {this.state.bob}
                    {this.state.popup}
                    {this.state.test}
                </CSSTransitionGroup>
                <Spacebar/>
                <EmptySpace/>
                {this.state.message &&
                    <Message message={this.state.message}/>
                }
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {this.state.catalogShow &&
                        <Catalog path={[0, 0, 0]} onClose={() => this.onClose()}/>
                    }
                </CSSTransitionGroup>*/}
                <button style={{
                    position: "fixed",
                    bottom: 10,
                    right: 10
                }} onClick={() => this.testChangeObject()}>Change object</button>
            </div>
        )
    }
});

export default App;
