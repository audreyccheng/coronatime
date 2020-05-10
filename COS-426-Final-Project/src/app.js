/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Vector2, AudioListener, Audio, AudioLoader } from '../node_modules/three/src/Three.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from './components/scenes';
import { C_HEIGHT, V_RADIUS, S_RADIUS } from './components/objects';
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

var renderScene = new RenderPass(scene, camera);
var composer = new EffectComposer( renderer );

var bloomStrength = 1;
var bloomRadius = 0;
var bloomThreshold = 0.1;

var bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), bloomStrength, bloomRadius, bloomThreshold);

composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Set up camera
camera.position.set(0, 0, 8);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// var btn = document.createElement("BUTTON");   // Create a <button> element
// btn.innerHTML = "CLICK ME";                   // Insert text
// document.body.appendChild(btn); 

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

var listener = new AudioListener();
camera.add( listener );
var sound = new Audio( listener );
var audioLoader = new AudioLoader();
var audioLoader2 = new AudioLoader();

let roundDistance = 0;
let maxDistance = 0;

let showMenu = false;
const startmenu = document.getElementById("startmenu");
const currentScore = document.getElementById("currentscore");
const scoreMenu = document.getElementById("scoremenu");

const startGame = event => {
    if (!showMenu) {
        startmenu.classList.add("started");
        scoremenu.classList.remove("started");
        showMenu = true;

    } else {
        startmenu.classList.remove("started");
        scoremenu.classList.add("started");
        showMenu = false;
    }
    audioLoader.load( './src/Osmosis_Jones_Intro.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop(true);
            sound.autoplay = true;
            sound.setVolume(0.5);
            sound.play();
        });
};

startGame();
// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);

    while (scene.cylinders[0] && scene.cylinders[0].position.z > camera.position.z + C_HEIGHT/2) {
    	scene.addCylinder();
    }
    while (scene.viruses[0] && scene.viruses[0].position.z > camera.position.z + C_HEIGHT/2) {
    	scene.addViruses(0);
    }
    while (scene.redcells[0] && scene.redcells[0].position.z > camera.position.z + C_HEIGHT/2) {
    	scene.addRedCells(0);
    }

    const curSpeed = 0.0675;
    [...scene.cylinders].forEach(obj => {
        obj.position.z += curSpeed;
    });
    roundDistance += curSpeed;

    const virusSpeed = 0.01;
    [...scene.viruses].forEach(obj => {
        obj.position.z += curSpeed;
        obj.position.x += curSpeed * (Math.random() * 2.0 - 1.0) * virusSpeed;
        obj.position.y += curSpeed * (Math.random() * 2.0 - 1.0) * virusSpeed;
    });

    const redCellSpeed = 0.2;
    [...scene.redcells].forEach(obj => {
        obj.position.z += curSpeed * redCellSpeed;
        obj.position.x += curSpeed * (Math.random() * 2.0 - 1.0) * redCellSpeed;
        obj.position.y += curSpeed * (Math.random() * 2.0 - 1.0) * redCellSpeed;
    });

    if (showMenu) {
        // audioLoader.load( './src/Osmosis_Jones_Intro.mp3', function( buffer ) {
        //     sound.setBuffer( buffer );
        //     sound.setLoop(true);
        //     sound.setVolume(0.5);
        //     sound.play();
        // });
    }

    currentScore.textContent = `${scene.virusCount}`;

    scene.simulate();

    for (let i = 0; i < scene.viruses.length; i++) {
    	let virus = scene.viruses[i];
    	const S_RADIUS = 0.1;
    	if (Math.sqrt((virus.position.x - scene.sphere.position.x) ** 2) + ((virus.position.y - scene.sphere.position.y) ** 2)
    		+ ((virus.position.z - scene.sphere.position.z) ** 2) < S_RADIUS) { //&& virus.position.z <= scene.sphere.position.z
    		scene.addViruses(i);
    		scene.addVirusCount();
            if (!showMenu) {
                audioLoader2.load( './src/squish.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop(false);
                    sound.setVolume(0.4);
                    sound.play();
                });
            }
    	}
    }

    let spherePos = scene.sphere.position.clone().setZ(0);
    const cameraPos = camera.position.clone().setZ(0);
    const disp = new Vector3().subVectors(spherePos, cameraPos);
    const dist = disp.length() ** 2;
    disp.setLength = (dist);
    camera.position.add(disp);

    camera.position.lerp(new Vector3(0, 0, camera.position.z), 0.1);
    camera.position.z = 1.2 + scene.sphere.position.z;

    composer.render();
};
window.requestAnimationFrame(onAnimationFrameHandler);


// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

window.addEventListener("keydown", handleImpactEvents, false);

function handleImpactEvents(event) {
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") { return; }

    // The vectors to which each key code in this handler maps
    const keyMap = {
        ArrowUp: new Vector3(0,  0.01,  0),
        ArrowDown: new Vector3(0,  -0.01,  0),
        ArrowLeft: new Vector3(-0.01,  0,  0),
        ArrowRight: new Vector3(0.01,  0,  0),
    };


    // space to remove start menu
    if (showMenu && event.key == " ") {
        startmenu.classList.remove("started");
        showMenu = false;
        scene.virusCount = 0;
        scoremenu.classList.add("started");
        if (sound.isPlaying) {
        sound.stop();
    }
        return;
    }

    // ignore other key presses if game hasn't started
    if (showMenu) {
        return;
    }

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
    if (scene.sphere != null) {
        scene.sphere.addForce(keyMap[event.key]);
    }
}
