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
