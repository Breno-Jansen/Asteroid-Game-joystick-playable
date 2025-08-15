class Laser {
    constructor(Ppos, angle, ult) {
        this.pos = createVector(Ppos.x, Ppos.y);
        this.vel = p5.Vector.fromAngle(angle);  // Spawns at the player position and with the same direction
        this.vel.mult(10);

        if (ult){
            this.isUlted = true;
            this.r = 30;  // Size reference
        } else {
            this.isUlted = false
            this.r = 1;
        }
        
    }

    update() {
        this.pos.add(this.vel); // Linear movement
    }

    render() {
        if(this.isUlted){
            strokeWeight(3);
            fill(200,160,0);    // If ulted, renders bigger and brighter lasers
            stroke(255,50,0);

            circle(this.pos.x, this.pos.y, this.r);
        }else {
            strokeWeight(3);
            stroke(255);        // Renders lasers
            point(this.pos.x, this.pos.y);

        }
    }

    offscreen() {
        if (this.pos.x > width + this.r ||  
            this.pos.x < -this.r || 
            this.pos.y > height + this.r || 
            this.pos.y < -this.r) {
            return true;    // When its offscreen, returns true for deletion
          } else {
            return false;
          }
    }

    hits(target) {
        let distance = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        if (distance < target.r){
            return true;            // When it hits the target (parameter), returns true
        } else {
            return false;
        }
    }
}
