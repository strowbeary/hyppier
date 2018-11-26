import {BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial} from "three";

export default function Room(scene) {
    const materialTransparent =  new MeshStandardMaterial({ transparent: true, opacity: 0, wireframe: true, side: DoubleSide} );
    const wallMaterial = new MeshStandardMaterial({
        flatShading: true,
        side: DoubleSide,
        metalness: 0,
        color: "#1864ab"
    });
    const groundMaterial = new MeshStandardMaterial({
        flatShading: true,
        side: DoubleSide,
        metalness: 0.1,
        color: "#efefef"
    });
    const geometry = new BoxGeometry(300, 150, 300, 1, 1, 1);
    const materials = [wallMaterial, materialTransparent, materialTransparent, groundMaterial, materialTransparent, wallMaterial];
    const mesh = new Mesh( geometry, materials );
    mesh.position.set(0, -75, 0);
    mesh.rotation.set(0, Math.PI / 4, 0);

    scene.add(mesh);
    this.update = function (time) {
    }
}
