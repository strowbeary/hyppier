import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";
import SimplexNoise from "simplex-noise";
import {onPatch} from "mobx-state-tree";
import {spawn} from "../utils/spawn-worker";
const simplex = new SimplexNoise("hyppier");

const HypeIndicator = observer(class HypeIndicator extends Component {

    frame = 0;

    state = {
        path: "",
        bubbles: []
    };

    componentDidMount() {

        this.loop();
    }

    loop() {
        const worker = spawn(function () {
            let bubbles = [];
            let frame = 0;
            let wave_height = 2;
            const point_number = 1;
            const delta_point = 10 / point_number;
            const globalHeight = 45;
            const bubbleNumber = 7 * wave_height;
            for(let i = 0; i < bubbleNumber; i++) {
                let speed = Math.random();
                bubbles.push({
                    speed,
                    scale: Math.random() / 6 + 0.05,
                    globalHeight,
                    x: (i + 0.5) * (point_number * delta_point) / (bubbleNumber)
                });
            }

            function noise(t, w) {
                let freq = 0.02;
                return Math.sin(t * freq + w) * Math.sin(t * freq / 3);
            }

            function loop() {
                let origin = [0,
                    noise(frame * point_number, 0) * (wave_height / 2)
                ];

                let path = `M ${origin[0]},${origin[1]} `;
                let previousPoint = origin;
                for (let i = 1; i <= point_number; i++) {
                    let b = [
                        previousPoint[0] + delta_point,
                        noise(frame * point_number, i) * (wave_height / 2)
                    ];
                    let p1 = [
                        delta_point / 2 + previousPoint[0],
                        previousPoint[1]
                    ];
                    let p2 = [
                        delta_point / 2 + previousPoint[0],
                        b[1]
                    ];
                    path += `C ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${b[0]},${b[1]} `;
                    previousPoint = b;
                }
                path += `L ${previousPoint[0]},${previousPoint[0]} ${point_number * delta_point},${globalHeight} `;
                path += `L ${point_number * delta_point},${globalHeight} 0,${globalHeight} `;
                path += `L 0,${globalHeight} 0,${origin[1]} z`;

                postMessage({
                    path,
                    bubbles: bubbles.map((bubble, i) => {
                        bubble.height = globalHeight * (frame / 1000 + bubble.speed) % globalHeight;
                        return bubble;
                    })
                });
                frame++;
            }
            onmessage = (e) => {
                //wave_height = 1.5 + e.data * 3;
               // console.log("current bubble number : ", bubbles.length, "\nbubble to add : ", Math.ceil(5 * wave_height - bubbles.length));
                /*for(let i = 1; i <= Math.ceil(5 * wave_height - bubbles.length); i++) {
                    let speed = Math.random();
                    bubbles.push({
                        speed,
                        scale: Math.random() / 6 + 0.05,
                        globalHeight
                    });
                }*/
            };
            setInterval(() => loop(), 4);
        });
        worker.onmessage = (event) => {
            this.setState({
                path: event.data.path,
                bubbles: event.data.bubbles
            });
        };
        onPatch(GameStore, (patch) => {
            if(patch.path.includes("level")) {
                worker.postMessage(GameStore.hype.level)
            }
        })
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
                                        <g key={id} transform={`translate(${bubble.x} ${bubble.globalHeight - bubble.height})`}>
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
