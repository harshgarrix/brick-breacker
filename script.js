// Basic canvas
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Mouse Movement
const mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener(`mousemove`, (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// // Main Player
class Player {
  constructor(x, y, length, height, color) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.height = height;
    this.color = color;
  }

  draw() {
    c.save();
    c.beginPath();
    c.rect(this.x, this.y, this.length, this.height);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
  }
}

// Ball
class Ball {
  constructor(x, y, dy, dx, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = dy;
    this.dx = dx;
    this.velocity = velocity;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();

    // ball pyhsics

    if (this.y + this.radius + this.dy > canvas.height) {
      // this.y = canvas.height - this.radius;
      this.dy = 0;
      this.dx = 0;
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

// obstacle
class Obstacle {
  constructor(x, y, length, height, color, status) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.height = height;
    this.color = color;
    this.status = status;
  }
}

let length = 150;
const height = 15;
const x = mouse.x;
const y = canvas.height - 60;

// let mousePosition = new Victor(0, 0);

let player = new Player(x, y, length, height, `blue`);

const bx = canvas.width / 2;
const by = canvas.height / 2;
const bradius = 11;
const dy = 4;
const dx = -4;
const velocity = 4;

let ball = new Ball(bx, by, dy, dx, bradius, `red`, velocity);

let obstacles = [];

let rowCount = 2;
let colCount = 6;

for (let r = 0; r < rowCount; r++) {
  obstacles[r] = [];
  for (let cl = 0; cl < colCount; cl++) {
    const x = (30 + cl * 50) * 1.8;
    const y = 60 + r * 40;
    const color = `rgb(${Math.random() * 255}, 120,150)`;
    obstacles[r][cl] = new Obstacle(x, y, 80, 15, color, false);
  }
}

let hit = 0;

function draw() {
  for (let cl = 0; cl < colCount; cl++) {
    for (let r = 0; r < rowCount; r++) {
      if (!obstacles[r][cl].status) {
        c.beginPath();
        c.rect(
          obstacles[r][cl].x,
          obstacles[r][cl].y,
          obstacles[r][cl].length,
          obstacles[r][cl].height
        );
        c.fillStyle = obstacles[r][cl].color;
        c.fill();
        c.closePath();
      }
      if (!obstacles[r][cl].status) {
        let b = obstacles[r][cl];
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + b.length &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + b.height
        ) {
          ball.dy *= -1;
          b.status = true;
        }
      }
    }
  }
}

// Rendering of all the objects
function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  c.beginPath();
  // c.moveTo(50, 100);
  c.lineTo(0, canvas.height - 60);
  c.lineTo(canvas.width, canvas.height - 60);
  c.strokeStyle = "black";
  c.stroke();
  c.save();

  // player drawing
  player.x = mouse.x - length / 2;
  player.update();

  // ball drawing
  ball.update();

  if (
    ball.y + ball.radius > player.y &&
    ball.y < player.y + player.height &&
    ball.x + ball.radius > player.x &&
    ball.x < player.x + player.length
  ) {
    let collidPoint = ball.x - (player.x + player.length / 2);
    collidPoint = collidPoint / (player.length / 2);
    let angle = collidPoint * (Math.PI / 3);
    ball.dy = -(ball.velocity * Math.cos(angle));
    ball.dx = ball.velocity * Math.sin(angle);
  }

  draw();
}

animate();

// // Main Player Movement
// window.addEventListener(`keydown`, (e) => {
//   switch (e.key) {
//     // case `ArrowUp`:
//     //   break;
//     case `ArrowLeft`:
//       player.x -= velocity;
//       break;
//     // case `ArrowDown`:
//     //   break;
//     case `ArrowRight`:
//       player.x += velocity;
//       break;
//   }
// });
