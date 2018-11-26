import {Clock, Color, OrthographicCamera, Scene, WebGLRenderer} from "three";
import OrbitControls from "three-orbitcontrols";
import Room from "./objects/room";
import {GeneralLights} from "./GeneralLights";
import Bed from "./objects/bed";

export function SceneManager(canvas) {

    const clock = new Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    };

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    camera.position.set(0, 20, 300);
    const controls = new OrbitControls(camera, renderer.domElement);
    const sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        const scene = new Scene();
        scene.background = new Color("#fff");

        return scene;
    }

    function buildRender({width, height}) {
        const renderer = new WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({width, height}) {
        const nearPlane = 1;
        const farPlane = 10000;
        return new OrthographicCamera(width / - 4, width / 4, height / 4, height / - 4, nearPlane, farPlane);
    }

    function createSceneSubjects(scene) {
        return [
            new GeneralLights(scene),
            new Room(scene),
            new Bed(scene)
        ];
    }

    this.update = function () {
        const elapsedTime = clock.getElapsedTime();
        controls.update();

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);
        renderer.render(scene, camera);
    };

    this.onWindowResize = function () {
        const {width, height} = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };
}
