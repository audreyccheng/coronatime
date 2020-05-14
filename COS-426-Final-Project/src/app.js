/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Vector2, AudioListener, Audio, AudioLoader } from '../node_modules/three/src/Three.js';
import { SeedScene } from './components/scenes';
import { S_RADIUS } from './components/objects';
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './styles.css';
import OJSONG from './components/sounds/Osmosis_Jones_Intro.mp3';
import VIRUS_SOUND from './components/sounds/squish.mp3';
import BC_SOUND from './components/sounds/crash.mp3';
import A1_SOUND from './components/sounds/antibody-1.mp3';
import A2_SOUND from './components/sounds/antibody-2.mp3'

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

var renderScene = new RenderPass(scene, camera);
var composer = new EffectComposer( renderer );

var bloomStrength = 0.5;
var bloomRadius = 0.5;
var bloomThreshold = 0.4;
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

// add audio
var listener = new AudioListener();
camera.add( listener );
var sound = new Audio( listener );
var audioLoader = new AudioLoader();
let soundOn = false;

// tube variables
let tubeRemove = -1;
let curTubeDist = 0;
let prevAngle = 0;

// html objects
let showMenu = false;
let endedGame = false;
let highScore = 0;
const startmenu = document.getElementById("startmenu");
const currentScore = document.getElementById("currentscore");
const endScore = document.getElementById("endscore");
const bestScore = document.getElementById("bestscore");
const scoreMenu = document.getElementById("scoremenu");
const endmenu = document.getElementById("endmenu");
const currentSpeed = document.getElementById("currentspeed");

// speed and movement variables
let netForce = new Vector3(0, 0, 0);
let startSpeed = 0.05;
let curSpeed = 0.05;
let maxSpeed = 0.13;
let speedUp = 0.00004;
let antiSlowDown = 0.03;
let invincibleDistance = 0;
let EPS = 0.001;
let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;

// determine if start menu should be displayed
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
};

// display end menu
function endGame() {
    endmenu.classList.add("ended");
    endScore.textContent = `${scene.virusCount}`;
    if (scene.virusCount > highScore) {
        highScore = scene.virusCount;
    }
    bestScore.textContent = `${highScore}`;
    endedGame = true;
    scoremenu.classList.remove("started");
    curSpeed =  startSpeed;
    // play theme song
    if (soundOn) {
        audioLoader.load(OJSONG, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop(true);
            sound.autoplay = true;
            sound.setVolume(0.5);
            sound.play();
        });
    }
}

startGame();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);

    // remove the tube and associated objects after it passed out of view of the camera behind the player
    if (curTubeDist >= 1.2 && tubeRemove !== -1) { 
        tubeRemove.geometry.dispose();
        tubeRemove.material.dispose();
        scene.tube.remove(tubeRemove);
        scene.tube.removeObjs();
        tubeRemove = -1;
    }

    // if player has been invincible for a distance of 10 units, turn off invincibility and reset settings
    if (invincibleDistance >= 10) {
        scene.sphere.invincible = false;
        invincibleDistance = 0;
        bloomPass.strength = 0.5;
    }

    scene.sphere.addForce(netForce);

    if (curSpeed < maxSpeed) {
        curSpeed += speedUp;
    }

    // Move/rotate the tube past the player
    const curve = scene.tube.curves[0]; // curve defining the tube segment the player is currently in
    const length = curve.getLength();

    const curPoint = curve.getPoint(curTubeDist/length); // current position of the player in the tube
    const nextPoint = curve.getPoint(Math.min((curTubeDist + curSpeed)/length, 1)); // next position of player in tube
    var vecMove = new Vector3();
    vecMove.subVectors(curPoint, nextPoint); // move the tube in the opposite direction you want the player to appear to move
    vecMove.applyAxisAngle(new Vector3(0,1,0), scene.tube.rotations[0]); // rotate movement vector by the amount the tube is rotated
    
    // rotate the tube so its tangent points in the direction the camera is looking
    // so the player appears to look forward down the tube's axis
    var tangent = curve.getTangent(Math.min((curTubeDist + curSpeed/2)/length, 1));
    var angle = tangent.angleTo(new Vector3(0,0,-1));
    if (scene.tube.left[0]) {
        scene.tube.rotateY(prevAngle - angle);
    } else {
        scene.tube.rotateY(angle - prevAngle);
    }
    prevAngle = angle;

    curTubeDist += curSpeed; // keep track of how far the player has moved in the current tube segment
    // if the player is invincible, keep track of the distance during which invincibility has be active
    if (scene.sphere.invincible) { 
        invincibleDistance += curSpeed;
    }
    // use the movement vector to move all the meshes in the tube object
    [...scene.tube.meshes].forEach(obj => {
        obj.position.x += vecMove.x;
        obj.position.y += vecMove.y;
        obj.position.z += vecMove.z;
    });
    [...scene.tube.clots].forEach(obj => {
        obj.position.x += vecMove.x;
        obj.position.y += vecMove.y;
        obj.position.z += vecMove.z;
    });
    [...scene.tube.viruses].forEach(obj => {
        obj.position.x += vecMove.x;
        obj.position.y += vecMove.y;
        obj.position.z += vecMove.z;
    });
    [...scene.tube.redcells].forEach(obj => {
        obj.position.x += vecMove.x;
        obj.position.y += vecMove.y;
        obj.position.z += vecMove.z;
    });
    [...scene.tube.antibodies].forEach(obj => {
        obj.position.x += vecMove.x;
        obj.position.y += vecMove.y;
        obj.position.z += vecMove.z;
    });

    scene.simulate(); // simulate sphere position

    if (curTubeDist >= length) { // if we have moved farther than current tube segment, remove it and reset 
        curTubeDist = 0;
        prevAngle = 0;
        tubeRemove = scene.tube.meshes[0];
        scene.tube.addTube();
    }

    // virus collision detection
    for (let i = 0; i < scene.tube.nviruses[0] + scene.tube.nviruses[1]; i++) {
        let virus = scene.tube.viruses[i];
        var vpos = virus.position.clone();
        vpos.z += 7;
        if (vpos.distanceTo(scene.sphere.position) < S_RADIUS + virus.radius + 0.01) {
    		scene.tube.removeVirus(i);
    		scene.addVirusCount();
            // sound effect
            if (!showMenu && !endedGame && soundOn) {
                audioLoader.load(VIRUS_SOUND, function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop(false);
                    sound.setVolume(0.4);
                    sound.play();
                });
            }
    	}
    }
    currentScore.textContent = `${scene.virusCount}`; // display score
    var speedShown = Math.floor(curSpeed*1000)/10;
    currentSpeed.textContent = `${speedShown.toFixed(1)}`; // display scaled speed

    // clot collision detection
    for (let i = 0; i < scene.tube.nclots[0] + scene.tube.nclots[1]; i++) {
        let clot = scene.tube.clots[i];
        var cpos = clot.position.clone();
        cpos.z += 7;
    	if (cpos.distanceTo(scene.sphere.position) < S_RADIUS + clot.radius - 0.1 && scene.sphere.invincible == false) {
            if (!showMenu) {
                endGame();
            }
    	}
    }

    // redcell collision detection
    for (let i = 0; i < scene.tube.nredcells[0] + scene.tube.nredcells[1]; i++) {
        let rc = scene.tube.redcells[i];
        var rpos = rc.position.clone();
        rpos.z += 7;
        // if a red cell gets too close, move it away from the sphere
        if (rpos.distanceTo(scene.sphere.position) < rc.radius + S_RADIUS + 0.1) {
            rpos.sub(scene.sphere.position);
            rc.position.add(rpos.multiplyScalar(0.1));
        }
    }

    // antibody collision detection
    for (let i = 0; i < scene.tube.nantibodies[0] + scene.tube.nantibodies[1]; i++) {
        let anti = scene.tube.antibodies[i];
        if (anti === undefined) {
            continue;
        }
        var apos = anti.position.clone();
        apos.z += 7;
        // if collision with antibody, apply power up and remove antibody
        if (apos.distanceTo(scene.sphere.position) < S_RADIUS + .05 ) {
            if (anti.type == 'invincible') {
                // invincibility powerup
                scene.sphere.invincible = true;
                invincibleDistance = 0;
                bloomPass.strength = 2.0;
                // sound effect
                if (!showMenu && !endedGame && soundOn) {
                    audioLoader.load(A1_SOUND, function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop(false);
                        sound.setVolume(0.4);
                        sound.play();
                    });
                }
            } else if (anti.type == 'speed') { 
                // speed powerup
                if (curSpeed - antiSlowDown > startSpeed) {
                    curSpeed -= antiSlowDown
                } else {
                    curSpeed = startSpeed;
                }
                // sound effect
                if (!showMenu && !endedGame && soundOn) {
                    audioLoader.load(A2_SOUND, function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop(false);
                        sound.setVolume(0.4);
                        sound.play();
                    });
                }
            }
            scene.tube.removeAntibody(i);
        }
    }

    // move camera to follow player
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
window.addEventListener("keyup", handleReleaseEvents, false);

// stop applying force on player
function handleReleaseEvents(event) {
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") { return; }

    // The vectors to which each key code in this handler maps
    const keyMap = {
        ArrowUp: new Vector3(0,  0.005,  0),
        ArrowDown: new Vector3(0,  -0.005,  0),
        ArrowLeft: new Vector3(-0.005,  0,  0),
        ArrowRight: new Vector3(0.005,  0,  0),
    };

    // ignore other key presses if game hasn't started
    if (showMenu || endedGame) {
        return;
    }

    // check only for bound keys
    if (event.key != "ArrowUp" && event.key != "ArrowDown" && event.key != "ArrowLeft"
      && event.key != "ArrowRight") {
        return;
    }
    if (scene.sphere != null) {
        let subForce = false;
        if (event.key == "ArrowUp" && upKey) {
            subForce = true;
            upKey = false;
        } else if (event.key == "ArrowDown" && downKey) {
            subForce = true;
            downKey = false;
        } else if (event.key == "ArrowLeft" && leftKey) {
            subForce = true;
            leftKey = false;
        } else if (event.key == "ArrowRight" && rightKey) {
            subForce = true;
            rightKey = false;
        }
        if (subForce) {
            netForce.sub(keyMap[event.key]);
        }
        if (Math.abs(netForce.x) < EPS) {
            netForce.x = 0;
        }
        if (Math.abs(netForce.y) < EPS) {
            netForce.y = 0;
        }    
    }
}

function handleImpactEvents(event) {
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") { return; }

    // The vectors to which each key code in this handler maps
    const keyMap = {
        ArrowUp: new Vector3(0,  0.005,  0),
        ArrowDown: new Vector3(0,  -0.005,  0),
        ArrowLeft: new Vector3(-0.005,  0,  0),
        ArrowRight: new Vector3(0.005,  0,  0),
    };

    // turn sound on/off
    if (event.key == "m") {
        if (soundOn) {
            soundOn = false;
        } else {
            soundOn = true;
        }
        // soundOn = !soundOn;
        if (showMenu && soundOn) {
            audioLoader.load(OJSONG, function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop(true);
                sound.autoplay = true;
                sound.setVolume(0.5);
                sound.play();
            });
        }
        if (!soundOn) {
            if (sound.isPlaying) {
                sound.stop();
            }
        }
    }

    // return to start menu after game ends
    if (endedGame && event.key == "s") {
        showMenu = false;
        endedGame = false;
        scene.virusCount = 0;
        endmenu.classList.remove("ended");
        startGame();
        return;
    }

    // restart game after it ends
    if (endedGame && event.key == " ") {
        endedGame = false;
        endmenu.classList.remove("ended");
        scene.virusCount = 0;
        scoremenu.classList.add("started");
        curSpeed =  startSpeed;
        if (sound.isPlaying) {
            sound.stop();
        }
        return;
    }


    // space to remove start menu
    if (showMenu && event.key == " ") {
        startmenu.classList.remove("started");
        showMenu = false;
        scene.virusCount = 0;
        scoremenu.classList.add("started");
        curSpeed =  startSpeed;
        if (sound.isPlaying) {
            sound.stop();
        }
        return;
    }

    // ignore other key presses if game hasn't started
    if (showMenu || endedGame) {
        return;
    }

    // check only for bound keys
    if (event.key != "ArrowUp" && event.key != "ArrowDown" && event.key != "ArrowLeft"
      && event.key != "ArrowRight") {
        return;
    }

    // move sphere position if arrow key pressed
    if (scene.sphere != null) {
        let addForce = false;
        if (event.key == "ArrowUp" && !upKey) {
            addForce = true;
            upKey = true;
        } else if (event.key == "ArrowDown" && !downKey) {
            addForce = true;
            downKey = true;
        } else if (event.key == "ArrowLeft" && !leftKey) {
            addForce = true;
            leftKey = true;
        } else if (event.key == "ArrowRight" && !rightKey) {
            addForce = true;
            rightKey = true;
        }
        if (addForce) {
            netForce.add(keyMap[event.key]);
        }
    }
}
