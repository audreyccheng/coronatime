import { Group, Vector3, PointsMaterial, Points, SphereGeometry } from 'three';

const S_RADIUS = 0.1;
const S_GEOMETRY = new SphereGeometry (
    S_RADIUS, // radius
    15,
    20,
);
const DRAG = 0.9;

export {S_RADIUS};

class Sphere extends Group {
    constructor(zBeginning) {
        // Call parent Group() constructor
        super();

        const geometry = S_GEOMETRY;
        const material = new PointsMaterial({ color: 0xFFFFFF, size: 0.005 })
        const mesh = new Points(geometry, material);

        mesh.rotation.x += Math.PI / 3;
        mesh.rotation.y += Math.PI / 3;
        mesh.rotation.z += Math.PI / 3;

        this.position.set(0, 0, zBeginning)
        this.name = 'sphere';
        this.add(mesh);
        this.velocity = new Vector3();
        this.netForces = new Vector3();
        this.invincible = false;
    }

    addForce(force) {
    	this.netForces.add(force);
    }

    updatePosition() {
        this.velocity.multiplyScalar(DRAG); // slow down 
        this.velocity.add(this.netForces); // apply force
        this.netForces.multiplyScalar(0); // reset force
    	this.position.x += this.velocity.x;
    	this.position.y += this.velocity.y;

        // make sure the sphere doesn't go past the walls of the tube
    	const cynLimit = 1 - S_RADIUS/2 - 0.1;
    	if (Math.sqrt(this.position.x*this.position.x + this.position.y*this.position.y) > cynLimit) {
    		let theta = Math.atan(this.position.y/this.position.x);
    		if (theta !== undefined) {
    			if (this.position.x < 0) {
    				this.position.x = -cynLimit * Math.cos(theta);
    				this.position.y = -cynLimit * Math.sin(theta);
    			} else {
    				this.position.x = cynLimit * Math.cos(theta);
    				this.position.y = cynLimit * Math.sin(theta);
    			}
    		}
    	}
    }


}

export default Sphere;