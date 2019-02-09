import {observer} from "mobx-react";
import React, {Component} from "react";
import "./_hypeIndicator.scss";
import GameStore from "../../../stores/GameStore/GameStore";
import {spawn} from "../utils/spawn-worker";

const HypeIndicator = observer(class HypeIndicator extends Component {

    frame = 0;

    state = {
        up: false,
        bubbles: []
    };

    componentDidMount() {
        this.loop();
        this.hypeLevel = GameStore.hype.level;
    }

    loop() {
        const worker = spawn(function () {
            let bubbles = [];
            let wave_height = 2;
            const point_number = 1;
            const delta_point = 10 / point_number;
            const globalHeight = 45;
            const bubbleNumber = 7 * wave_height;
            for (let i = 0; i < bubbleNumber; i++) {
                let speed = Math.random();
                bubbles.push({
                    speed,
                    r: 3 * (Math.random() / 6 + 0.05),
                    globalHeight,
                    x: (i + 0.5) * (point_number * delta_point) / (bubbleNumber)
                });
            }

            function loop() {
                postMessage({
                    bubbles: bubbles.map((bubble) => {
                        bubble.height = globalHeight * (frame / 1000 + bubble.speed) % globalHeight;
                        return bubble;
                    })
                });
            }

            setInterval(() => loop(), 4);
        });
        worker.onmessage = (event) => {
            this.setState({
                bubbles: event.data.bubbles
            });
        };

        onPatch(GameStore, (patch) => {
            if(patch.path.includes("level")) {
                console.log(this.hypeLevel, patch.value);
                if (this.hypeLevel < patch.value) {
                    this.setState({up: true});
                }
                this.hypeLevel = patch.value;
            }
        })*/
    }

    onTransitionEnd() {
        this.setState({up: false});
    }

    render() {

        return (
            <div className="gameIndicator">
                <div className="gameIndicator__wrapper">
                    <div className="gameIndicator__word">Hype</div>
                    <div className="jauge">
                        <div className="gameIndicator__level" style={{
                            "height": GameStore.hype.level * 100 + "%"
                        }} onTransitionEnd={() => this.onTransitionEnd()}>
                            <div className={`gameIndicator__wave ${this.state.up? 'anim':''}`}/>
                        </div>
                        <svg viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(0,5)">
                                {(() => this.state.bubbles.map((bubble, id) => {
                                    return (
                                        <g key={id}
                                           transform={`translate(${bubble.x} ${bubble.globalHeight - bubble.height})`}>
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
