const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector('#scoreEl');

const maps = [
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'I', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '_', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'I', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3']
  ],
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3']
  ]
];

// 
// Declarations
const pellets = [];
const powerUps = [];
let items = [];

let ghosts = [];
let player = {};

const keys = {
  w : { pressed: false},
  a : { pressed: false},
  s : { pressed: false},
  d : { pressed: false},
};

// Animation //
let currentLevelIndex = 1;
let lastKey = '';
let score = 0;
let animationId;
let prevMs = Date.now();
let accumulatedTime = 0;
const ghostReleaseIntervals = [0, 5, 10, 15];
let boundaries = generateBoundaries(currentLevelIndex, maps);
const ghostPositions = [
  [
    {
      x: Boundary.width  * 5 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2
    },
    {
      x: Boundary.width  * 4 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2 
    },
    {
      x: Boundary.width  * 5 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2 
    },
    {
      x: Boundary.width  * 6 + Boundary.width / 2,
      y: Boundary.height * 6 + Boundary.height / 2
    }
  ],
  [
    {
      x: Boundary.width  * 5 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2
    },
    {
      x: Boundary.width  * 4 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2 
    },
    {
      x: Boundary.width  * 5 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2 
    },
    {
      x: Boundary.width  * 6 + Boundary.width / 2,
      y: Boundary.height * 4 + Boundary.height / 2
    }
  ]
];

const game = {
  init() {
    accumulatedTime = 0;

    player  = new Player({
      position: {
        x: Boundary.width + Boundary.width/2,
        y: Boundary.height + Boundary.height/2
      },
      velocity: {
        x: 0,
        y: 0  
      },
    });

    ghosts = [
      new Ghost({
        position: ghostPositions[currentLevelIndex][0],
        velocity: { 
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0
        },
        imgSrc: './img/sprites/redGhost.png',
        state: 'active',
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][1],
        velocity: { 
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0
        },
        imgSrc: './img/sprites/greenGhost.png',
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][2],
        velocity: { 
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0
        },
        imgSrc: './img/sprites/orangeGhost.png',
      }),
      new Ghost({
        position: ghostPositions[currentLevelIndex][3],
        velocity: { 
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0
        },
        imgSrc: './img/sprites/yellowGhost.png',
      })
    ];
  },
  initStart() {
    player.state = 'paused';
    ghosts.forEach(ghost => ghost.state = 'paused');

    setTimeout(() => {
      player.state    = 'active';
      ghosts[0].state = 'active';
      ghosts[1].state = null;
      ghosts[2].state = null;
      ghosts[3].state = null;
    }, 1000);
  },
};

game.init();

function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  const currentMs = Date.now();
  const delta = (currentMs - prevMs) / 1000;
  prevMs = currentMs;

  if (player.state === 'active') accumulatedTime += delta;

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
        player.die();
        ghosts.forEach(ghost => ghost.state = 'paused');
        console.log('lose.');
      };
    };
  };

  // win condition goes here
  if (pellets.length === 1 && player.state === 'active') { // should be zero - not sure why extra pellet
    // console.log('win.')
    // cancelAnimationFrame(animationId);
    player.state = 'paused';
    ghosts.forEach(ghost => ghost.state = 'paused');

    setTimeout(() => {
      currentLevelIndex++;
      if (currentLevelIndex > maps.length - 1) currentLevelIndex = 0;
      boundaries = generateBoundaries(currentLevelIndex, maps);
      game.init();
      game.initStart();
    }, 1000);
  };

  // PowerUp Collision Detection
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

  // Item Collision Detection
  for (let i = items.length - 1; 0 <= i; i--) {
    const item = items[i];
    item.draw();

    if (
      Math.hypot(
        item.position.x - player.position.x,
        item.position.y - player.position.y
      ) <
      item.radius + player.radius
    ) {
      items.splice(i, 1);
      score += 50;
      scoreEl.innerHTML = score;
    };
  };
  
  // Pellet Collision Detection
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
    
    if (accumulatedTime > ghostReleaseIntervals[index] && !ghost.state) 
      ghost.enterGame(ghostPositions[currentLevelIndex][2]);
  });

  if (player.velocity.x > 0 ) player.rotation = 0;
  else if (player.velocity.x < 0 ) player.rotation = Math.PI;
  else if (player.velocity.y > 0 ) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0 ) player.rotation = Math.PI * 1.5;
};

animate();
