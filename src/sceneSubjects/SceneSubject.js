import {IcosahedronBufferGeometry, Mesh, MeshStandardMaterial} from "three";

export default function SceneSubject(scene) {

    const radius = 2;
    const mesh = new Mesh(new IcosahedronBufferGeometry(radius, 2), new MeshStandardMaterial({flatShading: true}));

    mesh.position.set(0, 0, -20);

    scene.add(mesh);

    this.update = function (time) {
        const scale = Math.sin(time) + 2;

        mesh.scale.set(scale, scale, scale);
    }
}
