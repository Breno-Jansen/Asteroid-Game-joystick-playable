class Asteroid {
    constructor(pos, vel, r) { // Optional arguments for debris
        if (pos) {
            this.pos = pos.copy();  // Debris spawns at the position of the hit asteroid
        } else {
            this.pos = createVector(random(width), random(height));
        }
        if (vel) {
            this.vel = vel; // Debris maintain the asteroid velocity
        } else {
            this.vel = p5.Vector.random2D().mult(random(MinVelMult, MaxVelMult));
        }
        
        this.direction = 0;
        this.rotationSpeed = random(-0.04, 0.04)
        
        this.sides = floor(random(10, 20)); // Random quatity of sizes
        
        if (r) {
            this.rmin = r;
            this.rmax = r + 15; // Setting proporcional sides to debris size reference
            this.r = map(this.sides, 10, 20, this.rmin, this.rmax); 

        } else {
            this.rmin = 50;
            this.rmax = 70;     // Setting proporcional sides to asteroid size reference
            this.r = map(this.sides, 10, 20, this.rmin, this.rmax);
        }
        this.offset = [];
        for (let i = 0; i < this.sides; i++) {  
            this.offset[i] = random(-8, 8);     // Asteroid distortion
        }        
    }

    update() {
        this.pos.add(this.vel);                 // Linear movement
        this.direction += this.rotationSpeed;   // Angular movement
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);      // Sets drawing positions
        rotate(this.direction);                 
        noFill();
        stroke(255);
        strokeWeight(2);
        beginShape();
        for (let i = 0; i < this.sides; i++) {
            let angle = map(i, 0, this.sides, 0, TWO_PI);
            let r = this.r + this.offset[i];    // Radius of each point in the asteroid
            let x = r * cos(angle);     
            let y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);        // Connects the points, forming the shape
        pop();
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

    hits(target){
        let distance = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y)
        if (distance < target.r){
            return true;            // When it hits the target (parameter), returns true
        } else {
            return false;
        }
    }

    hitsPlayer(){
        if (player.damage){
            soundDamage.play();
            setTimeout(() => {      // When it hits the ship, plays the according sound (damage or rock impact)
                player.damage = false;
            }, 500);
            
        } else {
            soundRockImpact.play();
        }
    }

    explode() {
        soundRockImpact.play();
        if(this.r >= 40){   // Only spawns debris if its bigger than 40
            let vel1 = this.vel.copy().rotate(PI / 4);   
            let vel2 = this.vel.copy().rotate(-PI / 4);  // spawns debris with 45 degrees of diference

            asteroids.push(new Asteroid(this.pos, vel1, 25));  
            asteroids.push(new Asteroid(this.pos, vel2, 25));
        }        

        if (!(points % 300 === 0) && points % 150 === 0 && points != 0){ 
            let angle = this.vel.heading(); // Shields orbs spawns every 300 points, starting at 150    
            orbs.push(new Orb(this.pos, angle, 2));
        }

        if (points % 300 === 0 && points != 0 && player.life < 100){ 
            let angle = this.vel.heading(); // Health orbs spawns every 300 points, starting at 300, if life not full   
            orbs.push(new Orb(this.pos, angle, 1));
        }

        if (points % 1005 === 0 && points != 0){
            let angle = this.vel.heading(); // Ult orbs spawns every 1005 points, starting at 1005
            orbs.push(new Orb(this.pos, angle, 3));
        }
        
    }
}
