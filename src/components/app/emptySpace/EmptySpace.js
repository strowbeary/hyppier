import React, {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

export default observer(class EmptySpace extends Component {
    static refs = [];

    static create(objectKind, scene) {
        const ref = React.createRef();
        EmptySpace.refs.push(ref);
        return <EmptySpace objectKind={objectKind} ref={ref} scene={scene} key={objectKind.name}/>;
    }

    state = {
        position: new BABYLON.Vector3(0, 0, 0)
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
    }

    componentDidMount() {
        this.setState({
            position: this.get2dPosition()
        });
    }

    updatePosition() {
        this.setState({
            position: this.get2dPosition()
        });
    }

    get2dPosition() {
        return BABYLON.Vector3.Project(
            this.objectKind.location.toVector3(),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        );
    }

    buildCatalog() {
        CatalogStore.openCatalog(CatalogStore.findobjectKindPath(this.objectKind.name));
    }

    render() {
        let {x, y} = BABYLON.Vector3.Project(
            this.objectKind.location.toVector3(),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        );
        if(isNaN(x) && isNaN(y)) {
            x = 0;
            y = 0;
        }

        const size = 30;

        let hide = CatalogStore.isOpen ? 'hide': '';
        let style = {
            'top': y - size / 2,
            'left': x - size / 2
        };
        return (
            <div className={`emptySpace ${hide}`} style={style} onClick={() => this.buildCatalog()}>
                <div className="emptySpace__wrapper">
                    <span>+</span>
                </div>
            </div>
        )
    }
});
