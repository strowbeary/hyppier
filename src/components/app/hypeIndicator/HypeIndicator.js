import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";
import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise("hyppier");

const HypeIndicator = observer(class HypeIndicator extends Component {

    frame = 0;

    state = {
        wave_height: 1.5 + GameStore.hype.level * 3,
        point_number: 2,
        delta_point: 5.45,
        globalHeight: 45,
        path: "",
        bubbles: []
    };

    componentDidMount() {
        for(let i = 1; i <= 26; i++) {
            let speed = Math.random();
            this.state.bubbles.push({
                speed,
                height: this.state.globalHeight * (this.frame + speed) % this.state.globalHeight,
                scale: Math.random() / 6 + 0.05,
                x: (i + 0.5) * (this.state.point_number * this.state.delta_point / 26)
            });
        }
        this.loop();
    }

    loop() {
        let origin = [
            0,
            simplex.noise2D((this.frame * this.state.point_number) / 2, 0) * (this.state.wave_height / 2)
        ];

        let path = `M ${origin[0]},${origin[1]} `;
        let previousPoint = origin;
        for (let i = 1; i <= this.state.point_number; i++) {
            let b = [
                previousPoint[0] + this.state.delta_point,
                simplex.noise2D((i + this.frame * this.state.point_number) / 2, 0) * (this.state.wave_height / 2)
            ];
            let p1 = [
                this.state.delta_point / 2 + previousPoint[0],
                previousPoint[1]
            ];
            let p2 = [
                this.state.delta_point / 2 + previousPoint[0],
                b[1]
            ];
            path += `C ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${b[0]},${b[1]}`;
            previousPoint = b;
        }
        path += `L ${previousPoint[0]},${previousPoint[0]} ${this.state.point_number * this.state.delta_point},${this.state.globalHeight} `;
        path += `L ${this.state.point_number * this.state.delta_point},${this.state.globalHeight} 0,${this.state.globalHeight}`;
        path += `L 0,${this.state.globalHeight} 0,${origin[1]} z`;

        let bubbles = this.state.bubbles.map((bubble) => {
            bubble.height = this.state.globalHeight * (this.frame + bubble.speed) % this.state.globalHeight;
            return bubble;
        });

        this.setState({
            path,
            bubbles
        });
        this.frame += 1 / (300 / this.state.wave_height);
        requestAnimationFrame(() => this.loop());
    }

    render() {

        return (
            <div className="gameIndicator">
                <div className="gameIndicator__wrapper">
                    <div className="gameIndicator__word">Hype</div>

                    <div className="jauge">
                        <svg style={{
                            top: 100 - GameStore.hype.level * 100 + "%"
                        }} viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(0,5)">
                                <path
                                    d={this.state.path}
                                    fill="orange"
                                    stroke="none">
                                </path>
                                {(() => this.state.bubbles.map((bubble, id) => {
                                    return (
                                        <g key={id} transform={`translate(${bubble.x} ${this.state.globalHeight - bubble.height})`}>
                                            <circle
                                                transform={`scale(${bubble.scale} ${bubble.scale})`}
                                                cx="0"
                                                cy="0"
                                                r="3"
                                                fill="rgba(255, 255, 255, 0.5)"
                                                stroke="none"/>
                                        </g>
                                    )
                                }))()}

                            </g>

                        </svg>
                    </div>
                    <div className={`pipo ${GameStore.pipo}`}></div>
                </div>
            </div>
        )
    }
});

export default HypeIndicator;
