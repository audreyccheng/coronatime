import { Group, Vector3 } from 'three';
import { SphereGeometry, MeshPhongMaterial, Mesh, BackSide } from "three";

const S_RADIUS = 0.1;
const S_GEOMETRY = new SphereGeometry (
    S_RADIUS, // radius
    12,
    12,
);

class Sphere extends Group {
    constructor(zBeginning) {
        // Call parent Group() constructor
        super();

        const geometry = S_GEOMETRY;
        const material = new MeshPhongMaterial({color: 0xffffff, flatShading: true,});
        const mesh = new Mesh(geometry, material);
        mesh.rotation.x += Math.PI / 2;

        // Init state
        this.state = {
            pos: zBeginning,
        };

        this.position.set(0, 0, 7)
        // this.position.z += zBeginning;
        this.name = 'sphere';
        this.add(mesh);
        this.velocity = new Vector3();
        this.netForces = new Vector3();
    }

    addForce(force) {
    	netForces.add(force);
    	velocity.add(netForces);
    	netForces.multiplyScalar(0.8);
    	this.position.x += velocity.x;
    	this.position.y += velocity.y;
    }

    updatePosition() {
    	velocity.add(netForces);
    	netForces.multiplyScalar(0.8);
    	this.position.x += velocity.x;
    	this.position.y += velocity.y;
    }


}

export default Sphere;