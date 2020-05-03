import { Group } from 'three';
import { CylinderGeometry, MeshPhongMaterial, Mesh, BackSide } from "three";

const C_RADIUS = 1;
const C_HEIGHT = 20;
const C_GEOMETRY = new CylinderGeometry (
    C_RADIUS, // top radius
    C_RADIUS, // bottom radius
    C_HEIGHT, // height
    32, // radial segments
    1, // height segments
    true, // openended
    0,
    2 * Math.PI,
);

class Cylinder extends Group {
    constructor(zBeginning) {
        // Call parent Group() constructor
        super();

        const geometry = C_GEOMETRY;
        const material = new MeshPhongMaterial({color: 0x330c0c, flatShading: true,});
        const mesh = new Mesh(geometry, material);
        material.side = BackSide;
        mesh.rotation.x += Math.PI / 2;

        // Init state
        this.state = {
            pos: zBeginning,
        };

        this.position.z += zBeginning;
        this.name = 'cylinder';
        this.add(mesh);
    }
}

export default Cylinder;
