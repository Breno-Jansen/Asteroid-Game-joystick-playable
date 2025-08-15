class Player {
    constructor() {
        this.pos = createVector(width / 2, height / 2); // Spawns in the center of the screen
        this.vel = createVector(0, 0);      // Stationary start
        this.direction = 0;
        this.turningClockWise = 0;
        this.r = 50;  // Size reference
        this.lasers = [];

        this.life = 50;
        this.shield = 0;    // Starting stats 
        this.ult = 0;

        this.alive = true;
        this.boosting = false;
        this.started = false;
        this.damage = false;        
        this.safe = false;          // Initial conditions
        this.shieldPressed = false;
        this.shieldActive = false;
        this.ultPressed = false;
        this.ultActive = false;
    }

    update(){
        this.pos.add(this.vel); // Linear movement
        this.vel.mult(0.99); // Friction

        if (this.boosting){
            this.boost();
        }

        for (let i = this.lasers.length - 1; i >= 0; i--) {
            this.lasers[i].render();
            this.lasers[i].update();    // Render each laser separately
        
            if (this.lasers[i].offscreen()) {
                this.lasers.splice(i, 1);   // Delets offscreen lasers
            } else {
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    const hitAsteroid = asteroids[j];
                    if (this.lasers[i] && this.ultActive && this.lasers[i].hits(asteroids[j])) {   
                        hitAsteroid.explode(); // When asteroids are hit whith ult they explode but the laser stays 
                        asteroids.splice(j, 1);  
                        points += 30;   // 30 more points for each asteroid hit with ultimate
                        break;
                    }
                    else if (this.lasers[i] && this.lasers[i].hits(asteroids[j])) {
                        hitAsteroid.explode();  // When asteroids are hit they explode and the laser dies
                        asteroids.splice(j, 1);
                        this.lasers.splice(i, 1);
                        points += 15;   // 15 points for each asteroid hit normaly
                        break;
                    }
                }
            }
        }

        for (let j = asteroids.length - 1; j >= 0; j--) {
            const hitAsteroid = asteroids[j];
            if (asteroids[j].hits(player)){ // If an asteroid hits the ship
                if (this.life > 50 && this.started && !this.safe){
                    this.life -= 50; // When vulnerable and hit, it loses 50 life and the asteroid its destroyed
                    this.damage = true; 
                    hitAsteroid.hitsPlayer();
                    asteroids.splice(j, 1);
                } else if (this.started && this.safe){
                    hitAsteroid.hitsPlayer();   // When safe, it doesnt get damage and destroys the asteroid
                    asteroids.splice(j, 1);
                    points += 15;
                } else if (this.life <= 50 && this.started) {
                    this.life = 0;         
                    this.death();           // When vulnerable and with 50 life points, the ship dies
                    message = 'You Died';
                    this.alive = false;           
                }                
            }
        }

        for (let i = orbs.length - 1; i >= 0; i--) {
            if (orbs[i].hits(player)){
                soundPop.play();
                orbs[i].powerUp();  // When the player gets the orb he gains the matching power
                orbs.splice(i,1);
            }   

            if (orbs.isDead){
                orbs.splice(i,1);   // After 5 seconds the orb dissapears
            }
        }

        if (asteroids.length <= 0 && this.started && this.alive){
            if (level < 4){
                astNumber += 3;     // Up to level 4 the asteroids increase by 3 at each level 
            } else if (level < 12) {
                MinVelMult += 0.5;  // From level 4 onwards the asteroids speed increases
                MaxVelMult += 0.5;
            }
            level++;
            this.started = false;
            initialize('Level '+ level +'', astNumber);     // New level message
        }      
    }

    render() {
        // Triangle properties
        const base = 45;
        const height = 60;
      
        // Triangle Center
        const cx = this.pos.x;
        const cy = this.pos.y;
      
        // Rotation coords to the center
        const tip    = { x: 0, y: -height * 2 / 3 }; 
        const left   = { x: -base / 2, y: height / 3 }; 
        const right  = { x: base / 2, y: height / 3 };   
      
        // Rotation function arround the center
        function rotatePoint(px, py, angle) {
          const cosA = cos(angle);
          const sinA = sin(angle);
          return {
            x: px * cosA - py * sinA + cx,
            y: px * sinA + py * cosA + cy
          };
        }
      
        const p1 = rotatePoint(tip.x, tip.y, this.direction);
        const p2 = rotatePoint(left.x, left.y, this.direction); // Ship corners
        const p3 = rotatePoint(right.x, right.y, this.direction);

        const p4 = rotatePoint(left.x+9, left.y+9, this.direction);
        const p5 = rotatePoint(right.x-9, right.y+9, this.direction);
        const p6 = rotatePoint(left.x+9, left.y+19, this.direction);  // Engine fire points
        const p7 = rotatePoint(right.x-9, right.y+19, this.direction);

        const p8 = rotatePoint(left.x+16, left.y-25, this.direction);
        const p9 = rotatePoint(right.x-16, right.y-25, this.direction);
        const p10 = rotatePoint(left.x+22, left.y-35, this.direction);  // Ship details
        const p11 = rotatePoint(right.x-22, right.y-35, this.direction);

        strokeWeight(2);
        
        if (!this.damage){
            stroke(200, 200, 255);
        } else {                            // Drawing ship
            stroke(200, 0, 0);
        }
        fill(60,60,60); 
        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

        strokeWeight(2);
        stroke(200, 200, 255);
        line(p8.x, p8.y, p10.x, p10.y);     // Drawing details
        line(p9.x, p9.y, p11.x, p11.y);


        if (this.boosting){
            strokeWeight(4);
            stroke(255,80,0);               // Drawing fire when boost is activated
            line(p4.x, p4.y, p6.x, p6.y);
            line(p5.x, p5.y, p7.x, p7.y);
        }

        if (this.shieldActive) {
            stroke(0, 0, 255, 50);          // Drawing shield arround the ship
            fill(0, 0, 255, 50);            
            circle(this.pos.x, this.pos.y, 85);
        }
    }

    interface() {
        if (message){
            try{
                const gp = navigator.getGamepads()[jytkIndex];
                if (gp && gp.connected){
                    stroke(0);
                    fill('white');      // Message when joystick is connected
                    text('Joystick: Connected', width - 275, 35);
                }
                else {
                    stroke(0);
                    fill('white');      // Message when joystick is disconnected after connection
                    text('Joystick: Disonnected', width - 320, 35);
                }
            } catch{
                stroke(0);
                fill('white');          // Message when joystick is disconnected
                text('Joystick: Disconnected', width - 320, 35);
            }

            if (!this.started){
                textSize(60);
                fill('white');
                stroke(255);        // Center message
                strokeWeight(2);
                text(message, width / 2 - message.length * 20, height / 2 - 60);
            }

            if (!this.alive){
                textSize(60);       // Death text
                text('You Died', width / 2 - 80, height / 2 - 60);
            }

            textSize(30);
            fill('white');                
            stroke(0);                                          // Points text
            text('Points: '+ points +'', 15, 35);
            
            stroke('green');
            text('Level: ' + level + '', 15, 70);               // Level text

            stroke('red');
            strokeWeight(2);
            if (this.life === 100){                             
                text('Life: '+ this.life +' (MAX)', 15, 105);   // Life text
            }else {
                text('Life: '+ this.life +'', 15, 105);
            }

            stroke('purple');                                   // Ults text
            text('Ults: ' + this.ult + '', 15, 140);

            stroke('blue');
            text('Shields: '+ this.shield +'', 15, 175);        // Shields text     
        }
    }

    boost(){
        let boostForce = p5.Vector.fromAngle(this.direction-PI/2);
        boostForce.mult(0.18);      // Boosting function
        this.vel.add(boostForce);
    }

    rotation(){
        try{   // Joystick mode
            const gp = navigator.getGamepads()[jytkIndex];
            if (gp && gp.connected) {
                // When joystick is connected, the rotation is controlled the left analog
                let Xaxis = gp.axes[0] || 0;
                let Yaxis = gp.axes[1] || 0;    
                
                // Player direction
                const deadZone = 0.1;
                if (abs(Xaxis) > deadZone || abs(Yaxis) > deadZone) {
                    this.direction = (atan2(Yaxis, Xaxis)+ PI/2);
                }
            }
        }catch{  

        }
        // Keyboard mode
        this.direction += 0.08* this.turningClockWise;
    }

    edges() {
        // Width edges teleport
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
          } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
          }
        // Height edges teleport 
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
          } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
          }
    }   

    activateShield() {
        if (this.shieldPressed && !this.shieldActive && this.shield > 0) {
            this.shieldActive = true;
            stroke(0,0,255,50);
            fill(0,0,255,50);               // Drawing shield
            circle(this.pos.x, this.pos.y, 85);
            this.safe = true;
            
            setTimeout(() => {  
                this.shield -= 1;
                this.safe = false;          // After 5 seconds the shield dissapears
                this.shieldPressed = false;
                this.shieldActive = false;
            }, 5000);
        }
    }

    activateUlt() {
        if (this.ultPressed && !this.ultActive && this.ult > 0) {
            this.ultActive = true;
            this.safe = true;
            
            setTimeout(() => {
                this.ult -= 1;
                this.safe = false;          // After 10 seconds the ult stops
                this.ultPressed = false;
                this.ultActive = false;
            }, 10000);
        }
    }

    death(){
        soundExplosion.play();
    }
}