import { Group } from 'three';
import { TorusBufferGeometry, MeshPhongMaterial, Mesh } from "three";

const CELL_RADIUS = 0.05;
const TUBE_RADIUS = 0.04;
const RADIAL_SEGMENTS = 11;  

const TUBULAR_SEGMENTS =  22;
const RC_GEOMETRY = new TorusBufferGeometry(
    CELL_RADIUS,
    TUBE_RADIUS,
    RADIAL_SEGMENTS,
    TUBULAR_SEGMENTS,
);

class RedCell extends Group {
    constructor(pos, rot) {
        // Call parent Group() constructor
        super();

        const geometry = RC_GEOMETRY;
        const material = new MeshPhongMaterial({color: 0x340c0c, flatShading: false,});
        const mesh = new Mesh(geometry, material);
        mesh.rotation.x += 2 * Math.PI * rot;
        geometry.computeBoundingSphere();

        this.mesh = mesh;
        this.radius = geometry.boundingSphere.radius;
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;
        this.name = 'redcell';
        this.add(mesh);
    }

    trashDispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

export default RedCell;
