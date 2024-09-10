const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// 
// Classes
// //
class Boundary {
  static width  = 40;
  static height = 40;
  constructor({ position }) {
    this.position = position;
    this.width  = 40;
    this.height = 40;
  }

  draw() {
    c.fillStyle = 'blue';
    c.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
};

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  };

  draw() {
    c.beginPath();
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    c.fillStyle = 'yellow';
    c.fill();
    c.closePath();
  };

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };
};

// 
// Declarations
// //
const boundaries = [];

const player = new Player({
  position: {
    x: Boundary.width + Boundary.width/2,
    y: Boundary.height + Boundary.height/2
  },
  velocity: {
    x: 0,
    y: 0  
  },
});

const keys = {
  w : { pressed: false},
  a : { pressed: false},
  s : { pressed: false},
  d : { pressed: false},
};

let lastKey = '';

const map = [
  ['-', '-', '-', '-', '-', '-',],
  ['-', ' ', ' ', ' ', ' ', '-',],
  ['-', ' ', '-', '-', ' ', '-',],
  ['-', ' ', ' ', ' ', ' ', '-',],
  ['-', '-', '-', '-', '-', '-',],
];

map.forEach((row, rowIndex) => {
  row.forEach((mapUnitSquare, columnIndex) => {
    switch (mapUnitSquare) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width  * columnIndex,
              y: Boundary.height * rowIndex
            }
          })
        );
        break;
    };
  });
});

// Animation //
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  
  player.update();
  player.velocity.x = 0;
  player.velocity.y = 0;

  if (keys.w.pressed && lastKey === 'w') player.velocity.y = -5
  if (keys.a.pressed && lastKey === 'a') player.velocity.x = -5
  if (keys.s.pressed && lastKey === 's') player.velocity.y = 5
  if (keys.d.pressed && lastKey === 'd') player.velocity.x = 5
};

animate();
// 

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = 
      lastKey = 'w';
      break
    case 'a':
      keys.a.pressed = 
      lastKey = 'a';
      break
    case 's':
      keys.s.pressed = 
      lastKey = 's';
      break
    case 'd':
      keys.d.pressed = 
      lastKey = 'd';
      break
  };
});

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = false;
      break
    case 'a':
      keys.a.pressed = false;
      break
    case 's':
      keys.s.pressed = false;
      break
    case 'd':
      keys.d.pressed = false;
      break
  };
});
