const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl');

canvas.width = innerWidth;
canvas.height = innerHeight;
 
// 
// Declarations
const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
  new Ghost({
    position: { 
      x: Boundary.width * 6 + Boundary.width/2,
      y: Boundary.height + Boundary.height/2 
    },
    velocity: { x: Ghost.speed, y: 0 }
  }),
  new Ghost({
    position: { 
      x: Boundary.width * 6 + Boundary.width/2,
      y: Boundary.height * 3 + Boundary.height/2 
    },
    velocity: { x: Ghost.speed, y: 0 },
    color: 'pink'
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

let lastKey = '';
let score = 0;

const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeHorizontal.png')
          })
        )
        break
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeVertical.png')
          })
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})

// Animation //
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // 
  // //
  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: { x: 0, y: -5 }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0;
        break;
      } else player.velocity.y = -5
    };
  };

  if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: { x: -5, y: 0 }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0;
        break;
      } else player.velocity.x = -5
    };
  };

  if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: { x: 0, y: 5 }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0;
        break;
      } else player.velocity.y = 5
    };
  };

  if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: { x: 5, y: 0 }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0;
        break;
      } else player.velocity.x = 5
    };
  };

  // detect collision between ghosts and player
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i];
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        cancelAnimationFrame(animationId);
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

  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      circleCollidesWithRectangle({
        circle: player,
        rectangle: boundary
      })
    ) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    };
  });
  
  player.update();

  ghosts.forEach(ghost => {
    ghost.update();

    // detect for collision for every single boundary within course
    const collisions = [];
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: { x: ghost.speed, y: 0 }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('right');
      };

      if (
        !collisions.includes('left') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: { x: -ghost.speed, y: 0 }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('left');
      };

      if (
        !collisions.includes('up') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: { x: 0, y: -ghost.speed }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('up');
      };

      if (
        !collisions.includes('down') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: { x: 0, y: ghost.speed }
          },
          rectangle: boundary
        })
      ) {
        collisions.push('down');
      };
    });
    if (collisions.length > ghost.prevCollisions.length) ghost.prevCollisions = collisions;

    if (JSON.stringify(collisions) != JSON.stringify(ghost.prevCollisions)) {

      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });
      const direction = pathways[Math.floor(Math.random() * pathways.length)]

      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break
        case 'up':
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break
        case 'right':
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break
        case 'left':
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break
      };

      ghost.prevCollisions = [];
      // 
    };
  });
  // 
  if (player.velocity.x > 0 ) player.rotation = 0;
  else if (player.velocity.x < 0 ) player.rotation = Math.PI;
  else if (player.velocity.y > 0 ) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0 ) player.rotation = Math.PI * 1.5;
  // 
}; // end of animate()

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
