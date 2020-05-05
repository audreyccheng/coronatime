import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Cylinder, Sphere, C_HEIGHT, RedCell, V_RADIUS } from 'objects';
import { BasicLights } from 'lights';
import { Virus } from '../objects';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        this.cylinders = [new Cylinder(0, true), new Cylinder(-1*C_HEIGHT, false), new Cylinder(-2*C_HEIGHT, true)];
        this.cylinderSwitch = false;
        this.sphere = new Sphere(8);
        this.lights = new BasicLights();
        this.viruses = [new Virus(getRandomVirusPos(6))];
        this.redcells = [new RedCell(new Vector3(0.4,0.3,6), 0.2), 
            new RedCell(new Vector3(0.5,0.6,5.8), 0.25), 
            new RedCell(new Vector3(0.2,0.7,6.3), 0.16),
            new RedCell(new Vector3(-0.5,-0.5,6.5), 0.19),
            new RedCell(new Vector3(-0.6,0.6,5.6), 0.23),
        ]
        this.cylinders.forEach(obj => this.add(obj));
        this.redcells.forEach(obj => this.add(obj));
        this.viruses.forEach(obj => this.add(obj));
        this.add(this.lights, this.sphere);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    // update(timeStamp) {
    //     const { rotationSpeed, updateList } = this.state;
    //     //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

    //     // Call update for each object in the updateList
    //     // for (const obj of updateList) {
    //     //     obj.update(timeStamp);
    //     // }
    // }

    addCylinder() {
        const newCylinder = new Cylinder(this.cylinders[this.cylinders.length - 1].position.z - C_HEIGHT, this.cylinderSwitch);
        this.cylinderSwitch = !this.cylinderSwitch;
        this.cylinders.push(newCylinder);
        this.add(newCylinder);
        this.remove(this.cylinders[0]);
        this.cylinders.shift();
    }

    addViruses() {
        this.remove(this.viruses[0]);
        this.viruses.shift();
        for (var i = 0; i < Math.random() * 4; i++) {
            var zpos = 5;
            if (this.viruses.length > 0) {
                zpos = this.viruses[this.viruse.length - 1].position.z - 0.5 - Math.random() * 2; 
            }
            const newVirus = new Virus(getRandomVirusPos(zpos));
            this.viruses.push(newVirus);
            this.add(newVirus);
        }
    }

    simulate() {
        this.sphere.updatePosition();
    }
}

function getRandomVirusPos(zpos) {
    const vbounds = 1.0 - V_RADIUS/2 - 0.08;
    var dist = Math.random() * vbounds;
    var theta = Math.random() * 2.0 * Math.PI;
    var position = new Vector3(dist*Math.cos(theta), dist*Math.sin(theta), zpos);
    return position;
}

export default SeedScene;

