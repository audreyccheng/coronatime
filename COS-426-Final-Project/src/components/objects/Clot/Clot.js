import { Group, Mesh, MeshPhongMaterial, TextureLoader,TorusKnotBufferGeometry } from 'three';
import TEXTURE from '../../textures/red-blood-cells.jpg'

class Clot extends Group {
    constructor(pos) {
        // Call parent Group() constructor
        super();

        const material = new MeshPhongMaterial({color: 0x300c0c, flatShading: false,})
        var texture = new TextureLoader().load(TEXTURE);
        material.map = texture;

        const radius = Math.random()* 0.16 + 0.05;
        const tubeRadius =  radius * 2;  
        const radialSegments = 20;  
        const tubularSegments =  30;  
        const p =  1; 
        const q =  3;  
        const geometry = new TorusKnotBufferGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
        geometry.computeBoundingSphere();
        const mesh = new Mesh(geometry, material);
        
        this.mesh = mesh;
        this.rotation.x = Math.random() * Math.PI * 2; // random rotation
        this.rotation.y = Math.random() * Math.PI * 2;
        this.rotation.z = Math.random() * Math.PI * 2;   
        this.radius = geometry.boundingSphere.radius;
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;
        this.name = 'clot';
        this.add(mesh);
    }

    trashDispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

export default Clot;
