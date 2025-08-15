class Orb {
    constructor(AstPos, angle, type) {
        this.pos = createVector(AstPos.x, AstPos.y);
        this.vel = p5.Vector.fromAngle(angle);  // Spawns at the asteroid explosion position
        this.type = type;
        this.r = 7;  // Size reference
        this.alpha = 255; 
        this.fadeSpeed = 1; // Fades away for 255 frames (4 seconds approximately)
        this.isDead = false;

    }
    
    update() {
        this.pos.add(this.vel);
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0) {
            this.alpha = 0;     // Fading and movement function
            this.isDead = true; 
        }
    }

    render() {
        strokeWeight(2) // Different orbs for different types
        if (this.type === 1){
            stroke(255, 0, 0, this.alpha);          // Healing orb = Red
            fill(255, 0, 0, this.alpha * 0.3);
        } else if (this.type === 2) {
            stroke(0, 0, 255, this.alpha);          // Shied orb = Blue
            fill(0, 0, 255, this.alpha * 0.3);        
        } else if (this.type === 3) {
            stroke(110, 15, 170, this.alpha);       // Ult orb = Purple
            fill(110, 15, 170, this.alpha * 0.3);  
        }
        circle(this.pos.x, this.pos.y, 15);
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
        let distance = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (distance < target.r){
            return true;            // When it hits the target (parameter), returns true
        } else {
            return false;
        }
    }

    powerUp() {     // Orb powers
        if (this.type === 1){
            if (player.life <= 50) {    // max life = 100
                player.life += 50;      // Heals 50 life points
            }
        } else if (this.type === 2) {
            player.shield += 1;         // Gains 1 shield
        } else if (this.type === 3){
            player.ult += 1;            // Gains 1 ult
        }
    }
}