import { Group, Curve } from 'three';
import { TubeBufferGeometry, MeshPhongMaterial, Mesh, BackSide, Vector3, TextureLoader, RepeatWrapping } from 'three';
import { Clot, Virus, RedCell, Antibody } from 'objects';
import TEXTURE from '../../textures/wall-texture.jpg'

//-----CURVES----------------------------------------------------------------------------------

const CURVED_SCALE = 3.2;
const CURVE_HEIGHT = Math.random() * 2.0 + 1;
const STRAIGHT_HEIGHT = Math.random() * 10.0 + 19;

class RightCurve extends Curve {
    constructor(scale, curveHeight) {
        super();
        this.scale = scale;
        this.curveHeight = curveHeight;
    }
    getPoint(t) {
        var d;
        var tx;
        var ty;
        var tz;

        if (t < 0.5) { // top half-circle
            d = 2 * Math.PI * (0.5 - t); // d goes from pi to 0 as t goes from 0 to 0.5
            tx = Math.cos(d) + 1;
            ty = 0;
            tz = -1.0 * this.curveHeight * Math.sin(d);
        } else { // bottom half-circle
            d = 2 * Math.PI * t; // d goes from pi to 2pi as t goes from 0.5 to 1
            tx = Math.cos(d) + 3;
            ty = 0;
            tz = -1.0 * this.curveHeight * Math.sin(d);
        }

        return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

class LeftCurve extends Curve {
    constructor(scale, curveHeight) {
        super();
        this.scale = scale;
        this.curveHeight = curveHeight;
    }
    getPoint(t) {
        var d;
        var tx;
        var ty;
        var tz;

        if (t < 0.5) { // top half-circle
            d = 2 * Math.PI * t; // d goes from 0 to pi as t goes from 0 to 0.5
            tx = Math.cos(d) - 1;
            ty = 0;
            tz = -1.0 * this.curveHeight * Math.sin(d);
        } else { // bottom half-circle
            d = 2 * Math.PI * (1.5 - t); // d goes from 2pi to pi as t goes from 0.5 to 1
            tx = Math.cos(d) - 3;
            ty = 0;
            tz = -1.0 * this.curveHeight * Math.sin(d);
        }

        return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

class StraightCurve extends Curve {
    constructor(scale) {
        super();
        this.scale = scale;
    }
    getPoint(t) {
        var tx = 0;
        var ty = 0;
        var tz = -1.0 * t;
        return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

//-----TUBE----------------------------------------------------------------------------------------

const TUBE_SEGMENTS = 50;
const RAD_SEGMENTS = 60;  
const T_RADIUS = 1;  
const CLOSED = false;

class Tube extends Group {
    constructor(startPos) {
        // Call parent Group() constructor
        super();
        
        var material = new MeshPhongMaterial({color: 0x330c0c, flatShading: false,});
        var texture = new TextureLoader().load(TEXTURE);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        material.map = texture;
        material.side = BackSide;

        var path = new RightCurve(CURVED_SCALE, 2.0);
        this.left = [false];
        var geometry = new TubeBufferGeometry(path, TUBE_SEGMENTS, T_RADIUS, RAD_SEGMENTS, CLOSED);
        this.meshes = [new Mesh(geometry, material)];
        this.curves = [path];
        this.rotations = [0];
        this.clots = [];
        this.viruses = [];
        this.redcells = [];
        this.antibodies = [];
        this.nclots = [];
        this.nviruses = [];
        this.nredcells = [];
        this.nantibodies = [];
        // add blood clot obstacles, viruses, and red blood cells to first tube path
        this.addClots(path, new Vector3(0,0,0));
        this.addViruses(path, new Vector3(0,0,0));
        this.addRedCells(path, new Vector3(0,0,0));
        this.addAntibodies(path, new Vector3(0,0,0));
        
        // create 2 more starting tubes
        this.tSwitch = false;
        for (var i = 0; i < 2; i++) {
            var nPath;
            if (this.tSwitch) {
                if (Math.random() < 0.5) {
                    nPath = new LeftCurve(CURVED_SCALE, CURVE_HEIGHT);
                    this.left.push(true);
                } else {
                    nPath = new RightCurve(CURVED_SCALE, CURVE_HEIGHT);
                    this.left.push(false);
                }
            } else {
                nPath = new StraightCurve(STRAIGHT_HEIGHT);
                this.left.push(false);
            }

            const geo = new TubeBufferGeometry(nPath, TUBE_SEGMENTS, T_RADIUS, RAD_SEGMENTS, CLOSED);
            this.meshes.push(new Mesh(geo, material));
            
            var tangent1 = this.curves[this.curves.length - 1].getTangent(1); // tangent at the end of previous mesh's curve
            tangent1.applyAxisAngle(new Vector3(0,1,0), this.rotations[this.rotations.length - 1]); // tangent at the end of previous mesh
            var tangent2 = nPath.getTangent(0); // tangent at beginning of this mesh's curve
            var angle = tangent2.angleTo(tangent1); // angle between previous mesh' and current mesh's tangents
            this.meshes[this.meshes.length - 1].rotateY(-1.0 * angle); // rotate this mesh to align its tangent with previous mesh's
            
            var end = this.curves[this.curves.length - 1].getPoint(1); 
            end.applyAxisAngle(new Vector3(0,1,0), this.rotations[this.rotations.length - 1]);
            end.add(this.meshes[this.meshes.length - 2].position); // end point of previous mesh
            this.meshes[this.meshes.length - 1].position.x = end.x; // move current mesh to start at end of previous
            this.meshes[this.meshes.length - 1].position.y = end.y;
            this.meshes[this.meshes.length - 1].position.z = end.z;

            // add blood clot obstacles, viruses, and red blood cells to the new tube
            this.addClots(nPath, end);
            this.addViruses(nPath, end);
            this.addRedCells(nPath, end);
            this.addAntibodies(nPath, end);

            this.curves.push(nPath);
            this.rotations.push(-1.0 * angle);
            this.tSwitch = !this.tSwitch;
        }

        this.position.x += startPos.x;
        this.position.z += startPos.z;
        this.name = 'tube';
        this.meshes.forEach(obj => this.add(obj));
        this.clots.forEach(obj => this.add(obj));
    }

    // tube.meshes[0] gets removed in scene once it is out of view, for now shift arrays and add tube/objects
    addTube() {
        // shift arrays to remove information for tube.meshes[0]
        this.curves.shift();
        this.meshes.shift();
        this.rotations.shift();
        this.left.shift();

        // add new tube
        var material = new MeshPhongMaterial({color: 0x330c0c, flatShading: false,});
        var texture = new TextureLoader().load(TEXTURE);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        material.map = texture;
        material.side = BackSide;

        var nPath;
        if (this.tSwitch) {
            if (Math.random() < 0.5) {
                nPath = new LeftCurve(CURVED_SCALE, CURVE_HEIGHT);
                this.left.push(true);
            } else {
                nPath = new RightCurve(CURVED_SCALE, CURVE_HEIGHT);
                this.left.push(false);
            }
        } else {
            nPath = new StraightCurve(STRAIGHT_HEIGHT);
            this.left.push(false);
        }

        const geo = new TubeBufferGeometry(nPath, TUBE_SEGMENTS, T_RADIUS, RAD_SEGMENTS, CLOSED);
        this.meshes.push(new Mesh(geo, material));
        
        var tangent1 = this.curves[this.curves.length - 1].getTangent(1); // tangent at the end of previous mesh's curve
        tangent1.applyAxisAngle(new Vector3(0,1,0), this.rotations[this.rotations.length - 1]); // tangent at the end of previous mesh
        var tangent2 = nPath.getTangent(0); // tangent at beginning of this mesh's curve
        var angle = tangent2.angleTo(tangent1); // angle between previous mesh' and current mesh's tangents
        this.meshes[this.meshes.length - 1].rotateY(-1.0 * angle); // rotate this mesh to align its tangent with previous mesh's
        
        var end = this.curves[this.curves.length - 1].getPoint(1); 
        end.applyAxisAngle(new Vector3(0,1,0), this.rotations[this.rotations.length - 1]);
        end.add(this.meshes[this.meshes.length - 2].position); // end point of previous mesh
        this.meshes[this.meshes.length - 1].position.x = end.x; // move current mesh to start at end of previous
        this.meshes[this.meshes.length - 1].position.y = end.y;
        this.meshes[this.meshes.length - 1].position.z = end.z;

        this.curves.push(nPath);
        this.rotations.push(-1.0 * angle);
        this.tSwitch = !this.tSwitch;
        this.add(this.meshes[this.meshes.length - 1]);

        // add blood clot obstacles, viruses, and red blood cells to the new tube
        this.addClots(nPath, end);
        this.addViruses(nPath, end);
        this.addRedCells(nPath, end);
        this.addAntibodies(nPath, end);
    }

    addClots(newPath, prevTubeEnd) {
        const numClots = Math.ceil(Math.random() * 3 + 1);
        this.nclots.push(numClots);
        for (var i = 0; i < numClots; i++) {
            var pos = newPath.getPoint(Math.random());
            //cpos.applyAxisAngle(new Vector3(0,1,0), -1.0 * angle);
            pos.add(prevTubeEnd);
            pos.x += (Math.random()*2 - 1) * 0.5;
            pos.y += (Math.random()*2 - 1) * 0.5;
            var bclot = new Clot(pos);
            this.clots.push(bclot);
            this.add(bclot);
        }
    }

    addViruses(newPath, prevTubeEnd) {
        const numViruses = Math.ceil(Math.random() * 10 + 5);
        this.nviruses.push(numViruses);
        for (var i = 0; i < numViruses; i++) {
            var pos = newPath.getPoint(Math.random());
            pos.add(prevTubeEnd);
            pos.x += (Math.random()*2 - 1) * 0.7;
            pos.y += (Math.random()*2 - 1) * 0.7;
            var nVirus = new Virus(pos);
            this.viruses.push(nVirus);
            this.add(nVirus);
        }
    }

    addRedCells(newPath, prevTubeEnd) {
        const numRC = Math.ceil(Math.random() * 7 + 3);
        this.nredcells.push(numRC);
        for (var i = 0; i < numRC; i++) {
            var pos = newPath.getPoint(Math.random());
            pos.add(prevTubeEnd);
            pos.x += (Math.random()*2 - 1) * 0.7;
            pos.y += (Math.random()*2 - 1) * 0.7;
            var newRC = new RedCell(pos, Math.random()*0.15 + 0.1);
            this.redcells.push(newRC);
            this.add(newRC);
        }
    }

    addAntibodies(newPath, prevTubeEnd) {
        const numAntibodies = Math.ceil(Math.random() * 3 + 2);
        this.nantibodies.push(numAntibodies);
        for (var i = 0; i < numAntibodies; i++) {
            var pos = newPath.getPoint(Math.random());
            pos.add(prevTubeEnd);
            pos.x += (Math.random()*2 - 1) * 0.6;
            pos.y += (Math.random()*2 - 1) * 0.6;
            var nAnti;
            if (Math.random() < 0.5) {
                nAnti = new Antibody(pos, 'invincible');
            } else {
                nAnti = new Antibody(pos, 'speed');
            }
            this.antibodies.push(nAnti);
            this.add(nAnti);
        }
    }

    removeVirus(index) {
        this.remove(this.viruses[index]);
        this.viruses.splice(index, 1);
    }

    removeObjs() {
        // shift clots
        for (var i = 0; i < this.nclots[0]; i++) {
            this.remove(this.clots[0])
            this.clots.shift();
        }
        this.nclots.shift();
        // shift viruses
        for (var i = 0; i < this.nviruses[0]; i++) {
            this.remove(this.viruses[0]);
            this.viruses.shift();
        }
        this.nviruses.shift();
        // shift red cells
        for (var i = 0; i < this.nredcells[0]; i++) {
            this.remove(this.redcells[0]);
            this.redcells.shift();
        }
        this.nredcells.shift();
        // shift antibodies
        for (var i = 0; i < this.nantibodies[0]; i++) {
            this.remove(this.antibodies[0]);
            this.antibodies.shift();
        }
        this.nantibodies.shift();
    }
}

export default Tube;
