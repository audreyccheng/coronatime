import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, FontLoader, MeshPhongMaterial, Mesh, TextGeometry } from 'three';
import { Sphere, RedCell, V_RADIUS, Tube, Virus } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            // rotationSpeed: 1,
            // updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x0);

        // Add meshes to scene
        this.tube = new Tube(new Vector3(0,0,7));
        this.sphere = new Sphere(7);
        this.lights = new BasicLights();
        // this.viruses = [new Virus(getRandomVirusPos(6))];
        // this.redcells = [new RedCell(new Vector3(0.4,0.3,-3), 0.2), 
        //     new RedCell(new Vector3(0.5,0.6,-2.8), 0.25), 
        //     new RedCell(new Vector3(0.2,0.7,-3.3), 0.16),
        //     new RedCell(new Vector3(-0.5,-0.5,6-3.5), 0.19),
        //     new RedCell(new Vector3(-0.6,0.6,-2.6), 0.23),
        // ]
        // this.redcells.forEach(obj => this.add(obj));
        // this.viruses.forEach(obj => this.add(obj));
        this.add(this.lights, this.sphere, this.tube);


        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    // update(timeStamp) {
    //     const { rotationSpeed, updateList } = this.state;
    //     //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

    //     // Call update for each object in the updateList
    //     // for (const obj of updateList) {
    //     //     obj.update(timeStamp);
    //     // }
    // }

    addVirusCount() {
        this.virusCount++;
    }

    // addRedCells(index) {
    //     this.remove(this.redcells[index]);
    //     this.redcells.shift();
    //     const numRedCells = 4;
    //     for (var i = 0; i < Math.random() * numRedCells; i++) {
    //         var zpos = 5;
    //         if (this.redcells.length > 0) {
    //             zpos = this.redcells[this.redcells.length - 1].position.z - 0.5 - Math.random() * 2; 
    //         }
    //         var rotation = Math.random() * 0.1 + .15;
    //         var newRedCell = new RedCell(getRandomVirusPos(zpos), rotation);
    //         this.redcells.push(newRedCell);
    //         this.add(newRedCell);
    //     }
    // }

    simulate() {
        this.sphere.updatePosition();
    }
}

// function getRandomVirusPos(zpos) {
//     const vbounds = 1.0 - V_RADIUS/2 - 0.08;
//     var dist = Math.random() * vbounds;
//     var theta = Math.random() * 2.0 * Math.PI;
//     var position = new Vector3(dist*Math.cos(theta), dist*Math.sin(theta), zpos);
//     return position;
// }

export default SeedScene;

