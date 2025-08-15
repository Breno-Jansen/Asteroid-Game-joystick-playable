// ReadMe has every controls and information you need :)

let player;
let asteroids = [];
let orbs = [];
let astNumber;          // Number of asteroids
let MinVelMult = 2;   // 0.9 1.8   
let MaxVelMult = 4;   // Min and max speed for asteroids
let message;
let level = 1;
let points = 0;

let jytkIndex = null;   // Joystick index is null before its connected

let prevR2 = false;     // Previous buttons value
let prevXbtn = false;

function preload(){
    soundLaser = loadSound('Laser.mp3');
    soundRockImpact = loadSound('RockImpact.mp3');
    soundExplosion = loadSound('Explosion.mp3');    // All imported sounds
    soundPop = loadSound('pop.mp3');
    soundDamage = loadSound('MetalDamage.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = new Player();  // Spawns ship

    window.addEventListener("gamepadconnected", (e) => {
    console.log("Joystick Conectado:", e.gamepad);          // Recognizes the joystick
    jytkIndex = e.gamepad.index;
    });
    initialize('New Game', 2);  // First message and number of asteroids at level 1
}

  
function draw() {
    background(15);
    if (player.alive) {
            player.rotation();
            player.edges();
            player.update();        // Player methods and controls only work when its alive
            player.render();
        
        try {
            if (jytkIndex !== null){
                const gp = navigator.getGamepads()[jytkIndex];
                

                // Buttons values
                const buttons = gp.buttons;
                const R2 = buttons[7].pressed;  // Recognizing buttons (R2 and X needed special treatment)
                const Xbtn = buttons[1].pressed;
                
            
                // Checking pressed buttons
                if (Xbtn && !prevXbtn && !R2) {
                    // console.log("X pressed");
                    if (player.ultActive){          // When ulted, shoots special lasers
                        player.lasers.push(new Laser(player.pos, player.direction - PI / 2, true));
                        soundLaser.play();  
                        player.started = true;
                    }
                    else{
                        player.lasers.push(new Laser(player.pos, player.direction - PI / 2));
                        soundLaser.play();
                        player.started = true;
                    }
                }
                if (buttons[0].pressed) {
                    // console.log("Ball pressed");
                    player.shieldPressed = true;
                }
                if (buttons[2].pressed) {
                    // console.log("Square pressed");
                    player.ultPressed =true;
                }   
                if (buttons[3].pressed) {
                    // console.log("Triangle pressed");
                }
                if (buttons[4].pressed) {
                    // console.log("L1 pressed");
                }
                if (buttons[5].pressed) {
                    // console.log("R1 pressed");
                }
                if (buttons[6].pressed) {
                    // console.log("L2 pressed");
                }
                if (R2 && !prevR2) {
                    // console.log("R2 pressed");
                    player.boosting = true;
                }
                if (R2) {
                    // console.log("R2 pressed");
                    player.started = true;
                }

                // Released buttons
                if (!R2 && prevR2){             // Stop boosting when R2 is released
                    player.boosting = false;
                }
                prevXbtn = Xbtn;
                prevR2 = R2;
            }
        }
        catch {

        }
    }
    
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].render();
        asteroids[i].update();      // Render each asteroid separately
        asteroids[i].edges();
    }

    for (let i = orbs.length - 1; i >= 0; i--) {
        orbs[i].render();
        orbs[i].update();       // Render each orb separately
        orbs[i].edges();
        if (orbs[i].isDead) {
            orbs.splice(i, 1);
        }
    
    }

    if (player.shieldPressed && player.shield > 0) {
        player.activateShield();
    }                               // Activate specials when pressed and available

    if (player.ultPressed && player.ult > 0) {
        player.activateUlt();
    }

    player.interface();     // Loads stats and informations on the top left
}

function initialize(textMessage, newAstNumber) {
    message = textMessage;
    astNumber = newAstNumber;   // Function that updates the center message and the number of asteroids
    for (let i = 0; i < astNumber; i++) {
        asteroids.push(new Asteroid());
    }
}

function keyPressed() {
    if (player.alive){
        if (key === 'w'){               // P5js function for keyboard mode
            player.boosting = true;
            player.started = true;
        }
        if (key === ' ' && !player.boosting){
            if (player.ultActive){          // When ulted, shoots special lasers
                player.lasers.push(new Laser(player.pos, player.direction - PI / 2, true));
                soundLaser.play();
                player.started = true;
            }
            else{
                player.lasers.push(new Laser(player.pos, player.direction - PI / 2));
                soundLaser.play();
                player.started = true;
            }
        }
        if (key === 'a'){
            player.turningClockWise = -1;
        }
        if (key === 'd'){
            player.turningClockWise = 1;
        }
        if (key === 'e'){
            player.shieldPressed = true;
        } 
        if (key === 'x'){
            player.ultPressed = true;
            
        }
    }
}

function keyReleased() {
    if (key === 'w'){                   // P5js function for keyboard mode
        player.boosting = false;
    }
    if (key === 'a'){
        player.turningClockWise = 0;
    }
    if (key === 'd'){
        player.turningClockWise = 0;
    }
   
}
