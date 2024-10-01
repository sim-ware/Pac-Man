const GHOST_SPEED = 75;

class Ghost {
  static speed = 1;
  constructor({ position, velocity, color = 'red' }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = 15;
    this.prevCollisions = [];
    this.speed = 2;
    this.scared = false;
    this.previousValidMoves = [];
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
    c.fillStyle = this.scared ? 'blue' : this.color;
    c.fill();
    c.closePath();
  };

  collision(boundaries) {
    for (const boundary of boundaries) {
      if (
        circleCollidesWithRectangle({
          circle: this,
          rectangle: boundary
        })
      ) {
        return true;
      };
    };
    return false;
  };

  snapToGrid() {
    const CELL_SIZE = 20;

    this.position = {
      x: Math.round(this.position.x / CELL_SIZE) * CELL_SIZE,
      y: Math.round(this.position.y / CELL_SIZE) * CELL_SIZE,
    };
  };

  // 
  gatherValidMoves(boundaries) {
    const directions = [
      { x:  1, y:  0 }, // RIGHT
      { x: -1, y:  0 }, // LEFT
      { x:  0, y:  1 }, // DOWN
      { x:  0, y: -1 }  // UP
    ];

    const validMoves = directions.filter((direction) => {
      const oppositeDirection = {
        x: -this.velocity.x,
        y: -this.velocity.y
      }

      return (
        direction.x !== oppositeDirection.x ||
        direction.y !== oppositeDirection.y
      );
    });

    const PIXEL_BUFFER = 5;
    for (const boundary of boundaries) {
      // 
      for (const direction of directions) {
      // 
        if (
          circleCollidesWithRectangle({
            circle: {
              ...this,
              velocity: { 
                x: direction.x * PIXEL_BUFFER,
                y: direction.y * PIXEL_BUFFER
              }
            },
            rectangle: boundary
          })
        ) {
          // return false;
          // splice out the direction from
          validMoves.splice(
            validMoves.findIndex(move => move.x === direction.x && move.y === direction.y),
            1
          );
        };
      };
    };
    return validMoves;
  };
  // 

  update(delta, boundaries) {
    this.draw();
    const validMoves = this.gatherValidMoves(boundaries);

    if (validMoves.length > 0 && validMoves.length !== this.previousValidMoves.length) {
      // change ghosts velocity
      const chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];

      this.velocity.x = chosenMove.x;
      this.velocity.y = chosenMove.y;
    };

    if (this.collision(boundaries)) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.snapToGrid(); 
    } else {
      this.position.x += this.velocity.x * delta * GHOST_SPEED;
      this.position.y += this.velocity.y * delta * GHOST_SPEED; 
    };

    this.previousValidMoves = validMoves;
  };
};