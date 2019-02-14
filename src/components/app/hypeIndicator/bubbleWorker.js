export function bubbleWorker() {
    let bubbles = [];
    const delta_point = 10;
    const globalHeight = 75;
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
            let height = globalHeight * (1 + bubble.speed / 2) * (frame / 300 + bubble.speed) % globalHeight;
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
}
