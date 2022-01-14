var frame_height = 20;
var speed_ball = 1.2;
var total_ball = 16;
var flickering = 400;

var canvas = document.getElementById("body-canvas");
canvas.setAttribute("style", "position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: -1; width: 100%;");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var particles = [];


//Particle object with random starting position, velocity and color
var Particle = function() {
    this.x = canvas.width * Math.random();
    this.y = canvas.height * Math.random();

    this.vx = speed_ball * Math.random();
    this.vy = speed_ball * Math.random();
    this.current_frame = 0;
    this.lastTime = Date.now();
    this.isReverse = false;
    this.img = new Image();
    this.img.src = "/images/bat.png";
    
}
//Ading two methods
Particle.prototype.Draw = function(ctx) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width)
        this.vx = -this.vx;

    if (this.y < 0 || this.y > canvas.height)
        this.vy = -this.vy;

    var time = Date.now();
    if (time - this.lastTime > flickering){
        if (this.isReverse){
            this.current_frame -= frame_height
        } else {
            this.current_frame += frame_height
        }
        
        if (this.current_frame == (this.img.height - frame_height)  || this.current_frame == 0) {
            this.isReverse = !this.isReverse;
        }
        this.lastTime = time;
    }

    ctx.drawImage(this.img, 0, this.current_frame, this.img.width, frame_height, this.x, this.y, this.img.width, frame_height);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
        particles[i].Draw(ctx);
    }
    requestAnimationFrame(loop);
}

//Create particles
for (var i = 0; i < total_ball; i++)
    particles.push(new Particle());

loop();

window.onresize = function() {  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}