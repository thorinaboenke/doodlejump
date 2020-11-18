document.addEventListener('DOMContentLoaded', () => {
  // start everything  only when the DOM content has loaded
  // create variables for the grid and the doodler
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  // define the left space and vertical starting point for the doodler
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  // define platform count and empty array that will be populated with platforms
  let platformCount = 5;
  let platforms = [];

  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let score = 0;

  function createDoodler() {
    // the steps to make an html element 'appear' with vanilla java script:
    grid.appendChild(doodler); // 1) append as child to another element
    doodler.classList.add('doodler'); // 2) add a class for styling
    doodlerLeftSpace = platforms[0].left; // (this line ensures that the doodler start on the lowest platform)
    doodler.style.left = doodlerLeftSpace + 'px'; //3) assign styles to the style property of the element
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  // stept to create a new Platform
  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315; // 315 is width of the grid - width of the platform, randomly places the platform vertically
      this.visual = document.createElement('div');
      // add a class for styling, define individual styles, append as child to make it appear on the page
      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  // create 5 platforms with  the lowest at 100 pixels and the others eqully spaced vertically above
  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  // if the doodler is lower than 200 px, subtract 4 px from every platform bottom value and apply this as new bottom style
  // if the platform is lower than 10 px, remove it from the array (shift) and increase the score by 1
  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';
        // if the platform is lower than 10 px, remove it from the array (shift) and increase the score by 1. Create a new platform, push it to the platform array, passing the constructor a height of 600 px
        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  // clear the interval from falling,
  //with An interval of 30 ms, increase the bottom style of the doodler by 20px, if the bottom is higher than start Point + 150, call fall()
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }

  // clear the interval from jumping.
  // with An interval of 30 ms, decrease the bottom style of the doodler by 5px,
  // if the doodler reaches the bottom of the grid (0)the game is over
  // if the doodler lands on platform (checking with forEach for every platform), jump()
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;

          jump();
        }
      });
    }, 30);
  }

  // removes all children from the grid, displays the score as inner HTML and clears all intervals
  function gameOver() {
    console.log('game over');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }
  // attach fundtion to key events for left, right and up
  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  // define the functions for moving left right and up
  // first clear opposite interval
  // set interval for increasing or decreasing the leftSpace (going left or right)
  // if the doodler touches a wall, reverse direction
  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveRight();
    }, 30);
  }
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveLeft();
    }, 30);
  }
  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }
  // start the game by creating doodler, platforms, setting the interval for moving the platforms, start with a jump from the lowest platform, add keyboard event listener
  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }
  //call function to start the game
  start();
});
