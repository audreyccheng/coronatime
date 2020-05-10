import { Group, ConeGeometry } from 'three';
import { SphereGeometry, MeshPhongMaterial, Mesh, Vector3 } from "three";

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
        
        // randomly & uniformly sample from surface of sphere to get position of spikes 
        const N = 6;
        const cone_geometry = C_GEOMETRY;
        var spikes = [];
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                var theta = (i / N + Math.random() * 1/N) * 2 * Math.PI;
                var u = (j / N + Math.random() * 1/N) * 2 - 1;
                var x = Math.sqrt(1 - u*u) * Math.cos(theta);
                var y = Math.sqrt(1 - u*u) * Math.sin(theta);
                var z = u;
                var sample = new Vector3(x, y, z);
                var normal = new Vector3(0,1,0);
                normal.cross(sample);
                
                var spike = new Mesh(cone_geometry, material);
                spike.setRotationFromAxisAngle(normal, sample.angleTo(new Vector3(0,1,0)) + Math.PI);
                spike.rotateX(Math.PI);
                
                spikes.push(spike);
            }
        } 
        
        this.name = 'redcell';
        this.add(body);
        spikes.forEach(obj => this.add(obj));
    }
}

export default Virus;
