import {SceneManager} from "./3dScene/sceneManager";

export default containerElement => {
    const canvas = createCanvas(document, containerElement);
    const sceneManager = new SceneManager(canvas);

    bindEventListeners();
    render();

    function createCanvas(document, containerElement) {
        const canvas = document.createElement("canvas");
        containerElement.appendChild(canvas);
        return canvas;
    }

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        resizeCanvas();
    }

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        sceneManager.onWindowResize();
    }

    function render() {
        requestAnimationFrame(render);
        sceneManager.update();
    }
}

