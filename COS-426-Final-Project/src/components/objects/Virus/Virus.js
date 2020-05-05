import { Group, ConeGeometry } from 'three';
import { SphereGeometry, MeshPhongMaterial, Mesh, BackSide } from "three";

const V_RADIUS = 0.06;
const S_SEGMENTS = 20; 
const V_GEOMETRY = new SphereGeometry(
    V_RADIUS - 0.02,
    S_SEGMENTS,
    S_SEGMENTS,
);

const C_RADIUS = 0.005;
const C_SEGMENTS = 20;
const C_GEOMETRY = new ConeGeometry(
    C_RADIUS, 
    2 * V_RADIUS, // height of cone
    C_SEGMENTS, // radial segments
);

export {V_RADIUS};

class Virus extends Group {
    constructor(pos) {
        // Call parent Group() constructor
        super();

        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;

        const material = new MeshPhongMaterial({color: 0x1bb52b, flatShading: true,});

        const body_geometry = V_GEOMETRY;
        const body = new Mesh(body_geometry, material);
        //body.position.set(this.position.x, this.position.y, this.position.z);

        
        const cone_geometry = C_GEOMETRY;
        var spikes = [];
        var s = new Mesh(cone_geometry, material);
        //s.position.y = -0.5 * V_RADIUS;
        spikes.push(s);
        for (var i = 0; i < 30; i++) {
            var xrot = 2 * Math.PI * Math.random();
            var zrot = 2 * Math.PI * Math.random();
            var spike = new Mesh(cone_geometry, material);
            spike.rotateX(xrot);
            spike.rotateZ(zrot);
            spikes.push(spike);
        } 
        
        
        this.name = 'redcell';
        this.add(body);
        spikes.forEach(obj => this.add(obj));
    }
}

export default Virus;
