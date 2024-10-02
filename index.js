const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl');

canvas.width = innerWidth;
canvas.height = innerHeight;
 
// 
// Declarations
const pellets = [];
const powerUps = [];
const ghosts = [
  new Ghost({
    position: { 
      x: Boundary.width * 5 + Boundary.width/2,
      y: Boundary.height * 5 + Boundary.height/2 
    },
    velocity: { 
      x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
      y: 0
    },
    imgSrc: './img/sprites/redGhost.png',
    state: 'active',
  }),
  new Ghost({
    position: { 
      x: Boundary.width * 4 + Boundary.width/2,
      y: Boundary.height * 6 + Boundary.height/2 
    },
    velocity: { 
      x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
      y: 0
    },
    imgSrc: './img/sprites/greenGhost.png',
  }),
  new Ghost({
    position: { 
      x: Boundary.width * 5 + Boundary.width/2,
      y: Boundary.height * 6 + Boundary.height/2 
    },
    velocity: { 
      x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
      y: 0
    },
    imgSrc: './img/sprites/orangeGhost.png',
  }),
  new Ghost({
    position: { 
      x: Boundary.width * 6 + Boundary.width/2,
      y: Boundary.height * 6 + Boundary.height/2 
    },
    velocity: { 
      x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
      y: 0
    },
    imgSrc: './img/sprites/yellowGhost.png',
  })
];

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

// Animation //
let lastKey = '';
let score = 0;
let animationId;
let prevMs = Date.now();
let accumulatedTime = 0;
const ghostReleaseIntervals = [0, 5, 10, 15];

const boundaries = generateBoundaries();

function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  const currentMs = Date.now();
  const delta = (currentMs - prevMs) / 1000;
  prevMs = currentMs;

  accumulatedTime += delta;

  if (keys.w.pressed && lastKey === 'w') player.move('up');
  if (keys.a.pressed && lastKey === 'a') player.move('left');
  if (keys.s.pressed && lastKey === 's') player.move('down');
  if (keys.d.pressed && lastKey === 'd') player.move('right');

  // detect collision between ghosts and player
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i];
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius && player.state === 'active'
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        // cancelAnimationFrame(animationId);
        player.die();
        ghosts.forEach(ghost => ghost.state = 'paused');
        console.log('lose.');
      };
    };
  };

  // win condition goes here
  if (pellets.length === 1) { // should be zero - not sure where extra pellet comes from
    console.log('win.')
    cancelAnimationFrame(animationId);
  };

  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();

    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1);

      // make ghosts scared
      ghosts.forEach(ghost => {
        ghost.scared = true;
        setTimeout(() => ghost.scared = false, 5000);
      });
    };
  };
  
  for (let i = pellets.length - 1; 0 < i; i--) {
    const pellet = pellets[i];
    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerHTML = score;
    }
  };

  boundaries.forEach((boundary) => boundary.draw());
  
  player.update(delta, boundaries);

  ghosts.forEach((ghost, index) => {
    ghost.update(delta, boundaries);
    
    if (accumulatedTime > ghostReleaseIntervals[index] && !ghost.state) ghost.enterGame();
  });

  if (player.velocity.x > 0 ) player.rotation = 0;
  else if (player.velocity.x < 0 ) player.rotation = Math.PI;
  else if (player.velocity.y > 0 ) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0 ) player.rotation = Math.PI * 1.5;
};

animate();
