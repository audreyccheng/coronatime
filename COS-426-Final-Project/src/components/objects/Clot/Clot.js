import { Group, Vector3, SphereGeometry, Mesh, MeshPhongMaterial, TextureLoader,TorusKnotBufferGeometry,RepeatWrapping, Euler } from 'three';
import TEXTURE from '../../textures/red-blood-cells.jpg'
//Blood-clot-texture.jpg'

class Clot extends Group {
    constructor(pos) {
        // Call parent Group() constructor
        super();

        const material = new MeshPhongMaterial({color: 0x300c0c, flatShading: false,})
        var texture = new TextureLoader().load(TEXTURE);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        material.map = texture;

        const radius = Math.random()* 0.2 + 0.01;
        const tubeRadius =  radius;  
        const radialSegments = 20;  
        const tubularSegments =  30;  
        const p =  1; 
        const q =  3;  
        const geometry = new TorusKnotBufferGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
        const mesh = new Mesh(geometry, material);
        // this.meshes = []
        // for (var i = 0; i < 3; i++) {
        //     var radius = Math.random()* 0.2 + 0.2;
        //     var geometry = new SphereGeometry (radius, 12, 8);
        //     var mesh = new Mesh(geometry, material);
        //     if (i == 0) {
        //         mesh.position.y = radius;
        //     } else if (i == 1) {
        //         mesh.position.x = -1.0 * radius;
        //     } else {
        //         mesh.position.x = radius;
        //     }
        //     this.meshes.push(mesh);
        // }
        //this.meshes.forEach(obj => this.add(obj));

        // var rcells = [];
        // const N = 9;
        // for (var i = 0; i < N; i++) {
        //     for (var j = 0; j < N; j++) {
        //         var theta = (i / N + Math.random() * 1/N) * 2 * Math.PI;
        //         var u = (j / N + Math.random() * 1/N) * 2 - 1;
        //         var x = Math.sqrt(1 - u*u) * Math.cos(theta);
        //         var y = Math.sqrt(1 - u*u) * Math.sin(theta);
        //         var z = u;
        //         var sample = new Vector3(x, y, z);
        //         sample.multiplyScalar(radius);
                
        //         var rotation = Math.random() * 0.1 + .15;
        //         var cell = new RedCell(sample, rotation)
                
        //         rcells.push(cell);
        //     }
        // } 
        //rcells.forEach(obj => this.add(obj));
        this.rotation.x = Math.random() * Math.PI * 2;
        this.rotation.y = Math.random() * Math.PI * 2;
        this.rotation.z = Math.random() * Math.PI * 2;
        this.radius = radius;
        this.position.x = pos.x + (Math.random()*2 - 1) * 0.5;
        this.position.y = pos.y + (Math.random()*2 - 1) * 0.5;
        this.position.z = pos.z + (Math.random()*2 - 1) * 0.5;
        this.name = 'clot';
        this.add(mesh);
    }
}

export default Clot;
