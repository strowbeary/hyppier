import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import GameCanvas from "./GameCanvas";
import {CSSTransitionGroup} from "react-transition-group";
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import Message from "./message/Message"
import Spacebar from "./spacebar/Spacebar"
import EmptySpace from "./emptySpace/EmptySpace"
import Notification from "./notification/Notification"
import HypeIndicator from "./hypeIndicator/HypeIndicator"
import PopupStore from "../../stores/PopupStore/PopupStore"
import Popup from "./popup/Popup"

const App = observer(class App extends Component {

    state = {catalogShow: false, message: null};

    componentDidMount() {
        this.setState({catalogShow: true, message: "Tu peux désormais accéder à ton grenier."});
    }

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject + 1, 0);
        }
    }

    onClose() {
        this.setState({catalogShow: false});
    }

    render() {
        return (
            <div id="app">
                <GameCanvas/>
                <HypeIndicator/>
                {this.state.message &&
                    <Message message={this.state.message}/>
                }
                {PopupStore.activePopup.map(path => {
                    return Popup.createPopup(path);
                })}
                <CSSTransitionGroup
                    transitionName="grow"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {PopupStore.catalogPopup &&
                        <Popup path={PopupStore.catalogPopup}/>
                    }
                </CSSTransitionGroup>
                <CSSTransitionGroup
                    transitionName="catalog"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {CatalogStore.isOpen &&
                        <Catalog path={CatalogStore.objectKindPath} onClose={() => CatalogStore.closeCatalog()}/>
                    }
                </CSSTransitionGroup>
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
