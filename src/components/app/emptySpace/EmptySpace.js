import React from 'react';
import {Component} from 'react';
import "./_emptySpace.scss";
import {observer} from "mobx-react";
import * as BABYLON from "babylonjs";
import CatalogStore from "../../../stores/CatalogStore/CatalogStore";

export default observer(class EmptySpace extends Component {

    static create(objectKind, scene) {
        return <EmptySpace objectKind={objectKind} scene={scene} key={objectKind.name}/>;
    }

    state = {
        position: new BABYLON.Vector3(0, 0, 0)
    };

    constructor(props) {
        super(props);
        this.scene = props.scene;
        this.objectKind = props.objectKind;
        this.objectKind.preloadNextObject();
    }
    componentDidMount() {
        this.scene.activeCamera.onViewMatrixChangedObservable.add(() => {
            this.setState({
                position: this.get2dPosition()
            })
        });
        window.addEventListener('resize', () => {
            this.setState({
                position: this.get2dPosition()
            });
        });
        this.setState({
            position: this.get2dPosition()
        });
    }

    get2dPosition() {
        return BABYLON.Vector3.Project(
            this.objectKind.location.toVector3().add(
                new BABYLON.Vector3(
                    0,
                    0.1,
                    0
                )
            ),
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
        let {x, y} = this.state.position;

        const size = 30;

        let style = {
            'top': y - size / 2,
            'left': x - size / 2
        };
        return (
            <div className="emptySpace" style={style} onClick={() => this.buildCatalog()}>
                <div className="emptySpace__wrapper">
                    <span>+</span>
                </div>
            </div>
        )
    }
});
