import { Group, SpotLight, AmbientLight, HemisphereLight, PointLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0x616171,0x616171,1.6);

        // light behind camera
        const plight = new PointLight(0xd5d5da, 1, 100, 2);
        plight.position.set(0, 0, -50);

        // light in the distance
        const plight2 = new PointLight(0xd5d5da, 1, 100, 0);
        plight2.position.set(0,0, 20);

        this.add(ambi, hemi, plight, plight2);
    }
}

export default BasicLights;
