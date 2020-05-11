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

    addVirusCount() {
        this.virusCount++;
    }

    simulate() {
        this.sphere.updatePosition();
    }
}

export default SeedScene;

