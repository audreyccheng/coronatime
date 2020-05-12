import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, FontLoader, MeshPhongMaterial, Mesh, TextGeometry } from 'three';
import { Sphere, RedCell, V_RADIUS, Tube, Virus } from 'objects';
import { BasicLights } from 'lights';
import Antibody from '../objects/Antibody/Antibody';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background to a nice color
        this.background = new Color(0x0);

        // Add meshes to scene
        this.tube = new Tube(new Vector3(0,0,7));
        this.sphere = new Sphere(7);
        this.lights = new BasicLights();
        this.add(this.lights, this.sphere, this.tube);
    }

    addVirusCount() {
        this.virusCount++;
    }

    simulate() {
        this.sphere.updatePosition();
    }
}

export default SeedScene;

