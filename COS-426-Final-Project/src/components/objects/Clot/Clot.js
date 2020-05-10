import { Group, Vector3 } from 'three';
import { RedCell } from 'objects';

class Clot extends Group {
    constructor(pos) {
        // Call parent Group() constructor
        super();

        var rcells = [];
        const N = 9;
        const radius = Math.random()* 0.2 + 0.2;
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                var theta = (i / N + Math.random() * 1/N) * 2 * Math.PI;
                var u = (j / N + Math.random() * 1/N) * 2 - 1;
                var x = Math.sqrt(1 - u*u) * Math.cos(theta);
                var y = Math.sqrt(1 - u*u) * Math.sin(theta);
                var z = u;
                var sample = new Vector3(x, y, z);
                sample.multiplyScalar(radius);
                
                var rotation = Math.random() * 0.1 + .15;
                var cell = new RedCell(sample, rotation)
                
                rcells.push(cell);
            }
        } 

        this.radius = radius;
        this.position.x = pos.x + (Math.random()*2 - 1) * 0.5;
        this.position.y = pos.y + (Math.random()*2 - 1) * 0.5;
        this.position.z = pos.z + (Math.random()*2 - 1) * 0.5;
        this.name = 'clot';
        rcells.forEach(obj => this.add(obj));
    }
}

export default Clot;
