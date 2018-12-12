import React from 'react';
import {Component} from 'react';
import "./_notification.scss";
import {observer} from "mobx-react";
import CountdownStore from "../../../stores/TimerStore/TimerStore";
import * as BABYLON from "babylonjs";

const Notification = observer(class Notification extends Component {

    constructor(props) {
        super(props);
        this.mesh = props.mesh;
        this.position = this.mesh.position;
        this.scene = props.scene;
        this.timer = CountdownStore.create(this.props.time);
        this.state = {position: this.getProjectedPosition()};
    }

    setProjectedPosition() {
        this.setState({position: this.getProjectedPosition()});
    }

    getProjectedPosition() { //does not seems to REALLY work...
        return BABYLON.Vector3.Project(
            this.position,
            this.mesh.computeWorldMatrix(true), //BABYLON.Matrix.Identity()
            this.scene.activeCamera.getViewMatrix().multiply(this.scene.activeCamera.getProjectionMatrix()), //scene.getTransformMatrix
            this.scene.activeCamera.viewport.toGlobal(
                this.scene.activeCamera.getEngine().getRenderWidth(),
                this.scene.activeCamera.getEngine().getRenderHeight()
            )
        )
    }

    buildCatalog() {
        this.timer.start();
    }

    render() {
        const dashSize = 134;
        let {x, y} = this.state.position;
        let style = {
            'top': y - 70,
            'left': x - 25
        };
        return (
            <div className="notification" style={style} onClick={() => this.buildCatalog()}>
                {/*<p>{this.timer.elapsedTime} / {this.timer.duration}</p>*/}
                <svg viewBox="0 0 22 26" width={50} height={60} xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1,0,0,1,-658.499,-1190.18)">
                        <g id="notification" transform="matrix(0.444838,0,0,0.440874,365.673,665.589)">
                            <rect x="658.276" y="1189.89" width="48.823" height="58.331"
                                  style={{
                                      fill: "none"
                                  }}/>
                            <g transform="matrix(0.980274,0,0,0.989086,42.4047,284.699)">
                                <circle cx="653.168" cy="940.236" r="19.28" style={{
                                    fill: "rgb(255,0,0)"
                                }}/>
                            </g>
                            <g transform="matrix(0.980274,0,0,-0.989086,38.5863,2202.62)">
                                <path d="M657.063,964.928L664.231,982.396L649.894,982.396L657.063,964.928Z"
                                      style={{
                                          fill: "rgb(255,0,0)"
                                      }}/>
                            </g>
                            <g transform="matrix(0.980274,0,0,0.989086,17.6057,283.695)">
                                <path d="M671.811,963.702C662.127,960.833 655.054,951.862 655.054,941.252C655.054,928.331 665.544,917.84 678.466,917.84C691.387,917.84 701.877,928.331 701.877,941.252C701.877,951.862 694.804,960.833 685.12,963.702"
                                      style={{
                                          fill: "none",
                                          stroke: "rgb(255,0,0)",
                                          strokeWidth: "2px"
                                      }}
                                      strokeDashoffset={this.timer.elapsedTime / this.timer.duration * -dashSize}
                                      strokeDasharray={dashSize}/>
                            </g>
                        </g>
                    </g>
                </svg>
                <p>{this.timer.elapsedTime} / {this.timer.duration}</p>
                <div>
                    {(()=> {
                        if(this.timer.ended) {
                            return (
                                <p>Ended</p>
                            )
                        }
                    })()}
                </div>
            </div>
        )
    }
});

export default Notification;
