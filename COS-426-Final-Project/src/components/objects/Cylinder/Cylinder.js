import { Group } from 'three';
import { CylinderGeometry, MeshPhongMaterial, Mesh, BackSide } from "three";

const C_RADIUS = 1;
const C_HEIGHT = 15;
const C_GEOMETRY = new CylinderGeometry (
    C_RADIUS, // top radius
    C_RADIUS, // bottom radius
    C_HEIGHT, // height
    50, // radial segments
    1, // height segments
    true, // openended
    0,
    2 * Math.PI,
);
export {C_HEIGHT};

class Cylinder extends Group {
    constructor(zBeginning, colorSwitch) {
        // Call parent Group() constructor
        super();

        const geometry = C_GEOMETRY;
        var material;
        if (colorSwitch) {
            material = new MeshPhongMaterial({color: 0x330c0c, flatShading: true,});
        } else {
            material = new MeshPhongMaterial({color: 0x300c0c, flatShading: true,});
        }
        const mesh = new Mesh(geometry, material);
        
        material.side = BackSide;
        mesh.rotation.x += Math.PI / 2;

        this.position.z += zBeginning;
        this.name = 'cylinder';
        this.add(mesh);
    }
}

export default Cylinder;
