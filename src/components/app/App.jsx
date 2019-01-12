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

const App = observer(class App extends Component {

    webGLRoot = React.createRef();
    state = {catalogShow: false, message: null};

    componentDidMount() {
        this.setState({catalogShow: true, message: "Tu peux désormais accéder à ton grenier."});
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
