import { Group, ConeGeometry } from 'three';
import { SphereGeometry, MeshPhongMaterial, Mesh, Vector3 } from "three";

const V_RADMAX = 0.08;
const V_RADMIN = 0.04;
const S_SEGMENTS = 20; 

const C_RADIUS = 0.005;
const C_SEGMENTS = 20;

class Virus extends Group {
    constructor(pos) {
        // Call parent Group() constructor
        super();

        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;
        this.radius = Math.random() * (V_RADMAX - V_RADMIN) + V_RADMIN;

        const material = new MeshPhongMaterial({color: 0x01680C, flatShading: false,});

        // body of the virus is a sphere
        const body_geometry = new SphereGeometry(
            this.radius * 0.75,
            S_SEGMENTS,
            S_SEGMENTS,
        );
        const body = new Mesh(body_geometry, material); 
        this.meshes = [body];
        
        // randomly & uniformly sample from surface of sphere to get position of spikes 
        const N = 6;
        const cone_geometry = new ConeGeometry(
            C_RADIUS, 
            2 * this.radius, // height of cone
            C_SEGMENTS, // radial segments
        );
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
                this.meshes.push(spike);
            }
        } 
        
        this.name = 'redcell';
        this.add(body);
        spikes.forEach(obj => this.add(obj)); // add spikes to stick out of the sphere body
    }

    trashDispose() {
        this.meshes.forEach(obj => {
            obj.geometry.dispose();
            obj.material.dispose();
         }
        );
    }
}

export default Virus;
