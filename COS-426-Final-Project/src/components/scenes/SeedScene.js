import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Flower, Land, Cylinder, Sphere } from 'objects';
import { BasicLights } from 'lights';

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
        //const land = new Land();
        //const flower = new Flower(this);
        this.cylinders = [new Cylinder(0), new Cylinder(-20)]
        //const cylinder = ;
        this.sphere = new Sphere(8);
        this.lights = new BasicLights();
        this.cylinders.forEach(obj => this.add(obj));
        this.add(this.lights, this.sphere);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        if (!SeedScene.eventHandlerRegistered) {
            document.addEventListener("keydown", handleImpactEvents, false);
            SeedScene.eventHandlerRegistered = true;
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }
    }

    addCylinder() {
        const newCylinder = new Cylinder(this.cylinders[this.cylinders.length - 1].position.z - 20);
        this.cylinders.push(newCylinder);
        this.add(newCylinder);
        this.remove(this.cylinders[0]);
        this.cylinders.shift();
    }

    simulate() {
        this.sphere.updatePosition();
    }
}

function handleImpactEvents(event) {
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") { return; }

    // The vectors tom which each key code in this handler maps
    const keyMap = {
        ArrowUp: new Vector3(0,  1,  0),
        ArrowDown: new Vector3(0,  -1,  0),
        ArrowLeft: new Vector3(-1,  0,  0),
        ArrowRight: new Vector3(1,  0,  0),
    };

    // const scale = 30; // the magnitude of the offset produced by this impact

    // check only for bound keys
    if (event.key != "ArrowUp" && event.key != "ArrowDown" && event.key != "ArrowLeft"
      && event.key != "ArrowRight" && event.key != "Enter") {
        return;
    }

    if (event.key == "Enter") {
        // SceneParams.GRAVITY = -1.0 * SceneParams.GRAVITY;
        return;
    }

    // move sphere position if arrow key pressed
    if (this.sphere != null) {
        this.sphere.addForce(keyMap[event.key]);
    }
}

export default SeedScene;
