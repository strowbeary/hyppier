import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";
import {spawn} from "../utils/spawn-worker";
import {onPatch} from "mobx-state-tree";

const HypeIndicator = observer(class HypeIndicator extends Component {

    state = {
        up: false,
        bubblePath: ""
    };
    mounted = false;

    componentDidMount() {
        this.hypeLevel = GameStore.hype.level;
        this.mounted = true;
        this.loop();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    loop() {
        const worker = spawn(function () {
            let bubbles = [];
            const delta_point = 10;
            const globalHeight = 55;
            const bubbleNumber = 20;
            for(let i = 0; i < bubbleNumber; i++) {
                let speed = Math.random();
                bubbles.push({
                    speed,
                    r: 3 * (Math.random() / 6 + 0.05),
                    globalHeight,
                    x: (i + 0.5) * (delta_point) / (bubbleNumber)
                });
            }

            function loop(frame) {

                let bubblePath = "";
                for(let bubble of bubbles) {
                    let height = globalHeight * (frame / 300 + bubble.speed) % globalHeight;
                    bubblePath +=  `M ${bubble.x - bubble.r},${globalHeight - height} `;
                    bubblePath +=  `a ${bubble.r},${bubble.r} 0 1,0 ${bubble.r * 2},0 `;
                    bubblePath +=  `a ${bubble.r},${bubble.r} 0 1,0 ${-bubble.r * 2},0 `;
                    bubblePath +=  `z`;
                }

                postMessage({
                    bubblePath
                });
            }
            onmessage = (e) => {
                loop(e.data);
            };
        });

        worker.onmessage = (event) => {
            if(this.mounted) {
                this.setState(event.data);
            }
        };

        onPatch(GameStore, (patch) => {
            if(patch.path.includes("level")) {
                if (this.hypeLevel < patch.value) {
                    this.setState({up: true});
                }
                this.hypeLevel = patch.value;
            }
        });

        let frame = 0;
        const animationLoop = () => {
            if(this.mounted) {
                worker.postMessage(frame);
                frame++;
            }
            requestAnimationFrame(animationLoop);
        };
        animationLoop();
    }

    onTransitionEnd() {
        this.setState({up: false});
    }

    render() {

        return (
            <div className="gameIndicator">
                <div className="gameIndicator__wrapper">
                    <div className="gameIndicator__word">Hype</div>
                    <div className={`jauge ${this.state.up? 'anim':''}`}>
                        <div className="level" style={{
                            "height": GameStore.hype.level * 100 + "%"
                        }} onTransitionEnd={(e) => this.onTransitionEnd(e)}>
                            <div className="wave"/>
                        </div>
                        <svg viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path
                                    d={this.state.bubblePath}
                                    fill="rgba(255, 255, 255, 0.7)"
                                    stroke="none">
                                </path>
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
