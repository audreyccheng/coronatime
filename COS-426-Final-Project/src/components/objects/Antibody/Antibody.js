import { Group } from 'three';
import { CylinderGeometry, Mesh, MeshBasicMaterial } from "three";

const TUBE_HEIGHT = 0.02;
const TUBE_RADIUS = 0.004;  

class Antibody extends Group {
    constructor(pos, type) {
        // Call parent Group() constructor
        super();
        var material;
        if (type == 'invincible') {
            material = new MeshBasicMaterial( { color: 0x59CDFC } );
        } else if (type == 'speed') {
            material = new MeshBasicMaterial( { color: 0xFFC031 } );
        }
        
        const geometry1 = new CylinderGeometry( TUBE_RADIUS, TUBE_RADIUS, TUBE_HEIGHT );
        const geometry2 = new CylinderGeometry( TUBE_RADIUS * 0.8, TUBE_RADIUS * 0.8, TUBE_HEIGHT - 0.005 );
        
        var mesh1 = new Mesh( geometry1, material );
        var mesh2 = new Mesh( geometry1, material );
        var mesh3 = new Mesh( geometry1, material );
        var mesh4 = new Mesh( geometry2, material );
        var mesh5 = new Mesh( geometry2, material );

        mesh1.position.y += TUBE_HEIGHT/2;
        mesh2.position.y += TUBE_HEIGHT/2;
        mesh3.position.y -= TUBE_HEIGHT/2;
        mesh4.position.y += TUBE_HEIGHT/2 - 0.005;
        mesh5.position.y += TUBE_HEIGHT/2 - 0.005;

        mesh1.rotateZ(0.7);
        mesh2.rotateZ(-0.7);
        mesh4.rotateZ(0.7);
        mesh5.rotateZ(-0.7);

        mesh1.position.x -= TUBE_HEIGHT/2 * Math.cos(0.7) + 0.002;
        mesh2.position.x += TUBE_HEIGHT/2 * Math.cos(0.7) + 0.002;
        mesh4.position.x -= TUBE_HEIGHT/2 * Math.cos(0.7) + 0.01;
        mesh5.position.x += TUBE_HEIGHT/2 * Math.cos(0.7) + 0.01;

        this.meshes = [mesh1, mesh2, mesh3, mesh4, mesh5];
        this.type = type;
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;
        this.name = 'antibody';
        this.add(mesh1, mesh2, mesh3, mesh4, mesh5);
    }

    trashDispose() {
        this.meshes.forEach(obj => {
            obj.geometry.dispose();
            obj.material.dispose();
         }
        );
    }
}

export default Antibody;
