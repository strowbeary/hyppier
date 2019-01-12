import React, {Component} from "react";
import "./_app.scss";
import {observer} from "mobx-react";
import { CSSTransitionGroup } from "react-transition-group";
//import WebglRoot from "./3dScene/WebglRoot"
//import FullScreenButton from "./options/FullScreenButton"
import CatalogStore from "../../stores/CatalogStore/CatalogStore";
import Catalog from "./catalog/Catalog"
import Message from "./message/Message"
import Spacebar from "./spacebar/Spacebar"
import EmptySpace from "./emptySpace/EmptySpace"
import Notification from "./notification/Notification"
import Popup from "./popup/Popup"

const App = observer(class App extends Component {

    webGLRoot = React.createRef();
    state = {catalogShow: false, message: null};

    componentDidMount() {
        this.setState({catalogShow: true, message: "Tu peux désormais accéder à ton grenier."});
        setTimeout(
            () => {
                this.setState({bob: Popup.createPopup("N'attends plus tu risquerais de louper le prochain Bob l'éponge !", "Tant pis !", "Retourner au catalogue")});
            }, 4000
        );
        setTimeout(
            () => {
                this.setState({popup: Popup.createPopup("2e POPUP", "Abandonner", "Être hype !")});
            }, 5000
        )
        setTimeout(
            () => {
                this.setState({test: Popup.createPopup("3e POPUP", "DROP", "DOUDOU")});
            }, 6000
        )
    }

    resizeWebGLRoot() {
        this.webGLRoot.current.changeSceneLimits();
    };

    testChangeObject() {
        const objectKindPath = CatalogStore.getObjectKind("Sound");
        if(objectKindPath.activeObject === null) {
            objectKindPath.setActiveObject(0, 0);
        } else if (objectKindPath.activeObject[0] + 1 < objectKindPath.objects.length) {
            objectKindPath.setActiveObject(objectKindPath.activeObject[0] + 1, 0);
        }
        console.log(objectKindPath.toJSON())
    }

    onClose() {
        this.setState({catalogShow: false});
    }

    render() {

        return (
            <div id="app">
                <CSSTransitionGroup
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
                <Notification hasTimer={true} time={15000}/>
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
                </CSSTransitionGroup>
                {/*<WebglRoot ref={this.webGLRoot} />
                <div  style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0
                }}>
                    <FullScreenButton onClick={() => this.resizeWebGLRoot()}/>
                    <button onClick={() => this.testChangeObject()} >Test change</button>
                </div>*/}
            </div>
        )
    }
});

export default App;
