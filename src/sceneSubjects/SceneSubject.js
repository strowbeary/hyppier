import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    DoubleSide
} from "three";

export default function SceneSubject(scene) {
    const materialTransparent =  new MeshStandardMaterial({ transparent: true, opacity: 0, wireframe: true, side: DoubleSide} );
    const material =  new MeshStandardMaterial({flatShading: true, side: DoubleSide, metalness: 0});
    const geometry = new BoxGeometry(28, 28, 28, 1, 1, 1);
    const materials = [ material, materialTransparent, materialTransparent, material, materialTransparent, material ];
    const mesh = new Mesh( geometry, materials );
    mesh.position.set(0, 0, 0);
    mesh.rotation.y = Math.PI / 4;


    scene.add(mesh);

    this.update = function (time) {

    }
}
