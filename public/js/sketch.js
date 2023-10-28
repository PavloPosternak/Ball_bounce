// gsap.registerPlugin(CSSPlugin);

let numBalls = 8;
let spring = 0.2; // elastic each other
let gravity = 0.08;
let friction = -0.2; //elastic to wall
let balls = [];
let height = window.innerHeight;
let width = window.innerWidth;
let sel_number = -1;
let img1 
let color = ['red','blue','green','yellow','pink']
addEventListener("resize", (event) => {
  console.log(document.body.clientWidth)
  // console.log(document.body.clientHeight)
  // height = document.body.clientHeight
  // width = document.body.clientWidth
  // setup()
  location.reload()
});

function setup() {
  createCanvas(width, height);
  img1 = loadImage('./bot.png');
  greeting = createElement('div').addClass('text');
  greeting.id("btn")  
  // $("#btn").attr("href","localhost:5173")
  $("#btn").html("<img src='./bot.png'/>")
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height),
      random(width/12, width/6),
      random(width/12, width/6),
      i,
      balls,
      false,
      false,
      Math.floor(random(0, 4)),
      random(0,255),
      random(0,255)
    );
  }
  // balls[0].selected = true
  // frameRate(30);
  noStroke();
  fill(255, 204);
}

function draw() {
  background(0);
  balls.forEach(ball => {
    // translate(ball.x-ball.diameter/2, ball.y-ball.diameter/2);
    ball.collide();
    ball.move();
    ball.display();
  });
}

class Ball {
  constructor(xin, yin, din1, din2, idin, oin,selected,clicked,color1,color2,color3) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din1;
    this.diameter2 = din2;
    this.id = idin;
    this.others = oin;
    this.selected = selected;
    this.clicked = clicked;
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = (this.others[i].diameter / 2 + this.diameter / 2)*1;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
        
      }
    }
  }

  move() {
    if(this.selected){
      this.x = mouseX;
      this.y = mouseY;
    }
    else
    {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x + this.diameter / 2 > width) {
        this.x = width - this.diameter / 2;
        this.vx *= friction;
      } else if (this.x - this.diameter / 2 < 0) {
        this.x = this.diameter / 2;
        this.vx *= friction;
      }
      if (this.y + this.diameter / 2 > height) {
        this.y = height - this.diameter / 2;
        this.vy *= friction;
      } 
      else if (this.y - this.diameter / 2 < 0) {
        this.y = this.diameter / 2;
        this.vy *= friction;
      }
    }
    
  }

  display() {
    // push()
    // translate(this.x-this.diameter/2, this.y-this.diameter/2);
    // rotate(frameCount / 100.0, [this.x-this.diameter/2, this.y-this.diameter/2]);
    // pop()
    if(this.clicked){
      // rotateY(frameCount * 0.01)

      greeting.position(this.x-this.diameter/2, this.y-this.diameter/2);

      image(img1, this.x-this.diameter/2,this.y-this.diameter/2, this.diameter, this.diameter);
      // greeting.position(this.x, this.y);
      // $("#btn img").attr("width",this.diameter*1.3)
      // $("#btn img").attr("height",this.diameter*1.3)
    }
    else{
      // fill(this.color1,this.color2,this.color3)
      // ellipse(this.x, this.y, this.diameter, this.diameter);
        let yellowOrangeGradient = drawingContext.createRadialGradient(this.x, this.y, this.diameter*0.01, this.x, this.y, this.diameter);
        yellowOrangeGradient.addColorStop(0, 'white');
        yellowOrangeGradient.addColorStop(0.8, color[this.color1]);
        yellowOrangeGradient.addColorStop(0.9, color[this.color1]);
        yellowOrangeGradient.addColorStop(1, 'white');
        drawingContext.fillStyle = yellowOrangeGradient;
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }
}

function mousePressed() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    let d = dist(mouseX, mouseY, ball.x, ball.y);

    if (d < ball.diameter/2) {
      console.log("Ball " + i + " was pressed!");

      balls[i].selected = true
      sel_number = i;
      break;
    }
  }
}
function mouseClicked() {
  // detect which ball was clicked
  for (let i = 0; i < balls.length; i++) {
      console.log(balls[i].clicked);
    
    let ball = balls[i];
    let d = dist(mouseX, mouseY, ball.x, ball.y);
    if (d < ball.diameter/2) {

      if (ball.clicked) {
        window.open("https://www.example.com")
      }
      else{
        // $("#btn img").attr("width",ball.diameter)
        greeting.position(ball.x-ball.diameter/2, ball.y-ball.diameter/2);
        $("#btn img").attr("width",ball.diameter)
        $("#btn img").attr("height",ball.diameter)
        gsap.fromTo("#btn",{opacity:1,rotationY:0},{rotationY:180,opacity:0, duration:1})
        // gsap.fromTo("#btn",{opacity:1,rotationY:0},{rotationY:180,opacity:0, duration:1})

        balls[i].clicked = true
        break;
      }
    }
  }
}


function mouseReleased() {
  for (let i = 0; i < balls.length; i++) {
     balls[i].selected = false
     balls[i].clicked = false
  }
  if(sel_number>=0){
    balls[sel_number].vx = 0;
    balls[sel_number].vy = 0;
  }
}
function doubleClicked() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    let d = dist(mouseX, mouseY, ball.x, ball.y);
    if (d < ball.diameter/2&&ball.clicked) {
      console.log("Ball " + i + " was dblclicked!");
      window.open("https://www.example.com")
      break;
    }
  }
}