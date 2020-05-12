import { Group } from 'three';
import { CylinderGeometry, MeshPhongMaterial, Mesh, BackSide, LineBasicMaterial, LineSegments, EdgesGeometry } from "three";

const C_RADIUS = 1;
const C_HEIGHT = 15;
const C_GEOMETRY = new CylinderGeometry (
    C_RADIUS, // top radius
    C_RADIUS, // bottom radius
    C_HEIGHT, // height
    30, // radial segments
    1, // height segments
    true, // openended
    0,
    2 * Math.PI,
);
export {C_HEIGHT};

class Cylinder extends Group {
    constructor(zBeginning, colorSwitch) {
        // Call parent Group() constructor
        super();

        const geometry = C_GEOMETRY;
        var geo = new EdgesGeometry( geometry );
        // var smap =  ImageUtils.loadTexture('../../textures/wall-texture.jpg', {}, function(){});
        var material;
        if (colorSwitch) {
            material = new MeshPhongMaterial({color: 0x330c0c, flatShading: false,}); // bmap: smap, 
            // material = new LineBasicMaterial({color: 0x330c0c, linewidth: 0 } );
        } else {
            material = new MeshPhongMaterial({color: 0x300c0c, flatShading: false,});
            // material = new LineBasicMaterial({color: 0x300c0c, linewidth: 0 } );
        }

        const mesh = new Mesh(geometry, material);
        // const mesh = new LineSegments(geo, material);

        material.side = BackSide;
        mesh.rotation.x += Math.PI / 2;

        this.position.z += zBeginning;
        this.name = 'cylinder';
        this.add(mesh);
    }
}

export default Cylinder;