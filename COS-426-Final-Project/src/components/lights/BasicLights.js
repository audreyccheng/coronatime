import { Group, SpotLight, AmbientLight, HemisphereLight, DirectionalLight, PointLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0x616171,0x616171,1.6) //(0xffffbb, 0x080820, 2.3); 0x39394d


        const dlight = new DirectionalLight(0xffffff, 1);
        const plight = new PointLight(0xd5d5da, 1, 100, 2);
        plight.position.set(0, 0, -50);

        dlight.position.set(0, 0, 9);
        // dlight.target.position.set(0, 0, -5);

        dir.position.set(0, 0, 9);
        // dir.target.position.set(0, 0, 8);

        const plight2 = new PointLight(0xd5d5da, 1, 100, 0);
        plight2.position.set(0,0, 20);

        this.add(ambi, hemi, plight, plight2); //hemi, dir
    }
}

export default BasicLights;
