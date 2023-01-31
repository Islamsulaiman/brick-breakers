const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

const pause = document.getElementById("pause-button");

const image = new Image();
image.src = "images/white.webp";
const BRICK_IMG = new Image();
BRICK_IMG.src = "images/Capture.PNG";
const CRACKED_IMG = new Image();
CRACKED_IMG.src = "images/crackedPNG.PNG";
const heartImage = new Image();
heartImage.src = "images/heart.png";
const boardImage = new Image();
boardImage.src = "images/board.png";

//increment for each brick broken.
let boardWidth = 90;
const boardHeight = 15;
const boardMarginBottom = 30;

const sounds = {
  ballHitBrick: new Audio("/sounds/brick.mp3"),
  ballHitBoard: new Audio("/sounds/brick.mp3"),
  gameStart: new Audio("/sounds/brick.mp3"),
  gameFinish: new Audio("/sounds/game-over.mp3"),
  nextLevel: new Audio("/sounds/level-up.mp3"),
  brickCrack: new Audio("/sounds/brick_hit.mp3"), //Sound Effect from pixapay
  pauseGameSound: new Audio("/sounds/pause.mp3"), //Sound Effect from pixapay
  onLoadSound: new Audio("/sounds/game_start.mp3"), //Sound Effect from pixapay
};

//event listeners
canvas.addEventListener("mousemove", mouseHandler);
addEventListener("DOMContentLoaded", onLoadPage);
pause.addEventListener("click", pauseGame);

function onLoadPage(e) {
  pauseAllSounds();

  resetGame();
  createBricks();
  resetBoard();
  paint();

  pen.font = "50px ArcadeClassic";
  pen.fillStyle = "lime";
  pen.fillText("PRESS START", canvas.width / 2 - 120, canvas.height / 2);
}

function pauseGame(e) {
  //change the value of pause back and forth
  game.paused = game.paused === false ? true : false;
  pause.innerText = pause.innerText === "Resume" ? "Pause" : "Resume";
  pauseAllSounds();
  sounds.pauseGameSound.play();
  loop();
}

let game = {
  //requestId is the id returned by requestAnimationFrame(), that indicates the id of it's callback func in the queue waiting for the stack
  requestId: null,
  hearts: 3,
  speed: 10,
  score: 0,
  scoreGain: 5,
  level: 1,
  timeoutId: null,
  paused: false,

  startPrizeScore: 70,
  startPrizeSwitch: "false",
  incrementPrizeSwitch: "false",
  prizeIncr: 20,

  boardTimeOut: null,

  music: true,
  sfx: true,
};

function resetGame() {
  game.hearts = 3;
  game.requestId = null;
  game.score = 0;
  game.level = 0;
  game.paused = false;
  pause.innerText = "Pause";

  game.startPrizeSwitch = "false";
  game.incrementPrizeSwitch = "false";
  game.prizeIncr = 10;
}

const radiusBall = 10;

const board = {
  x: canvas.width / 2 - boardWidth / 2,
  y: canvas.height - boardHeight - boardMarginBottom,
  width: boardWidth,
  height: boardHeight,
};
let brick = {
  row: 1,
  column: 3,
  brickFinished: false,
  brickHits: 0, //max is no of bricks * 2 'no of hits for each brick'
  width: 60,
  height: 20,
  offsetLeft: 30,
  offsetTop: 20,
  marginTop: 40,
};

function resetBricks() {
  brick.brickFinished = false;
  brick.brickHits = 0;
}

let bricks = []; // 2d array of bricks

//create bricks
function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      if (
        (r == 3 && c == 3) ||
        (r == 3 && c == 8) ||
        (r == 1 && c == 2) ||
        (r == 2 && c == 10)
      ) {
        bricks[r][c] = {
          x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
          y:
            r * (brick.offsetTop + brick.height) +
            brick.offsetTop +
            brick.marginTop,
          status: 3, //  2 is unbroken brick // 1 cracked brick //0 hidden brick // 3 is unbreakable brick
        };
      } else {
        bricks[r][c] = {
          x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
          y:
            r * (brick.offsetTop + brick.height) +
            brick.offsetTop +
            brick.marginTop,
          status: 2, //  2 is unbroken brick // 1 cracked brick //0 hidden brick
        };
      }
    }
  }
}
createBricks();

function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status === 3) {
        pen.beginPath();
        pen.fillStyle = "#6c757d";
        pen.strokeStyle = "#ced4da";
        pen.lineWidth = "2";
        pen.rect(b.x, b.y, brick.width, brick.height);
        pen.fill();
        pen.stroke();
      } else if (b.status === 2) {
        //unbroken brick
        pen.drawImage(BRICK_IMG, b.x, b.y, brick.width, brick.height);
      } else if (b.status === 1) {
        //cracked brick
        pen.drawImage(CRACKED_IMG, b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

const ball = {
  x: canvas.width / 2,
  y: board.y - radiusBall,
  radius: radiusBall,
  dx: game.speed * (Math.random() * 2 - 1),
  dy: -game.speed,
};

function drawBall() {
  pen.beginPath();
  pen.fillStyle = "#d8b4a0";
  pen.strokeStyle = "#d77a61";
  pen.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  pen.fill();
  pen.stroke();
  pen.closePath();
}
function resetBoard() {
  board.x = canvas.width / 2 - boardWidth / 2;
  board.y = canvas.height - boardHeight - boardMarginBottom;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = board.y - radiusBall;
  ball.dx = game.speed * (Math.random() * 2 - 1);
  ball.dy = -game.speed;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function ballWall() {
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    ball.y = ball.radius;
  }
  if (ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    ball.x = ball.radius;
  }
  if (ball.x + ball.radius * 2 > canvas.width) {
    ball.dx = -ball.dx;
    ball.x = canvas.width - 2 * ball.radius;
  }
  if (ball.y > canvas.height) {
    game.hearts--;
    resetBoard();
    resetBall();
  }
}

function ballBoard() {
  if (
    ball.y + ball.radius >= board.y &&
    ball.y - ball.radius <= board.y + board.height && // to differentiate between collision and ball going out
    ball.x + ball.radius >= board.x &&
    ball.x - ball.radius <= board.x + board.width
  ) {
    let collisionPoint = ball.x - (board.x + board.width / 2);
    collisionPoint = collisionPoint / (board.width / 2); //to set values to (-1 0 1)
    let angle = (collisionPoint * Math.PI) / 3;

    //play sound only when the ball is going down towards the paddle
    if (ball.dy > 0) {
      sounds.ballHitBoard.play();
    }

    ball.dx = game.speed * Math.sin(angle);
    ball.dy = -game.speed * Math.cos(angle);
  }
}

// let imageLoot = {
//   imageX: 0,
//   imageY: 0,
//   prize: "",
// };

let lootArray = [];

function randomPrize() {
  let prizeOptions = ["heart", "board"];
  let randomPrize =
    prizeOptions[Math.floor(Math.random() * prizeOptions.length)];

  return randomPrize;
}

function drawLoot() {
  lootArray.forEach((obj) => {
    if (obj.prize === "heart") {
      pen.drawImage(heartImage, obj.imageX, obj.imageY, 20, 20);
    } else {
      pen.drawImage(boardImage, obj.imageX, obj.imageY, 50, 50);
    }
  });
}

function moveLoot() {
  lootArray.forEach((obj) => {
    if (obj.imageY + 1 > canvas.height) {
      lootArray.splice(lootArray.indexOf(obj), 1);
      // lootArray.splice(index, 1);
    } else {
      obj.imageY++;
    }
  });
}

//this func determine if it's time drop a loot or not
function incrementTrackerSwitch() {
  if (game.score === game.startPrizeScore) {
    //because it will divide by zero
    return true;
  } else if ((game.score - game.startPrizeScore) % game.prizeIncr === 0) {
    return true;
  } else {
    return false;
  }
}

function ballBrickCollision() {
  //in update
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status > 0) {
        if (
          ball.x + ball.radius >= b.x &&
          ball.x - ball.radius <= b.x + brick.width &&
          ball.y + ball.radius >= b.y &&
          ball.y - ball.radius <= b.y + brick.height
        ) {
          // if brick and ball touched
          ball.dy = -ball.dy;
          if (b.status <= 2) {
            b.status--;
            brick.brickHits++;
            game.score += game.scoreGain;
            //keep track of new score at the local storage
            updateLocalStorageScore(game.score);

            //open switch to start give the player prizes
            if (
              game.score === game.startPrizeScore &&
              game.startPrizeSwitch === "false"
            ) {
              // ignore unbreakable brick(b.status === 3), and startPrizeSwitch is false , open the startPrizeSwitch
              game.startPrizeSwitch = "true";
            }
          }
          //play sounds
          if (b.status === 0) {
            sounds.brickCrack.play();
          } else {
            sounds.ballHitBrick.play();
          }

          //check for startPrizeSwitch if true then start giving prize

          if (b.status != 3) {
            if (game.startPrizeSwitch === "true") {
              //try to invoke this function after fixed intervals of score increase

              let incrementTracker = incrementTrackerSwitch();

              if (incrementTracker) {
                game.incrementPrizeSwitch = "true";
                //1)create object
                let imageLoot = {};
                imageLoot.prize = randomPrize();
                // console.log(imageLoot.prize);
                imageLoot.imageX = b.x;
                imageLoot.imageY = b.y;
                //2 push
                lootArray.push(imageLoot);
              }
              // else if (!incrementTracker) {
              //   game.incrementPrizeSwitch = "false";
              //   console.log("no prize");
              // }
            }
          }
        }
      }
    }
  }
}

function increaseHarts() {
  //increase game.hearts
  game.hearts++;
}

function increaseBoardWidth() {
  //1 increase the width immediately
  if (board.width === 90) {
    board.width = 160;
    //2change the width back after 5 sec
    setTimeout(() => {
      // change width back
      board.width = 90;
    }, 15000);
  }
}

function drawBoard() {
  pen.beginPath();
  pen.fillStyle = "#3c6e71";
  pen.strokeStyle = "#284b63";
  pen.lineWidth = "2";
  pen.rect(board.x, board.y, board.width, board.height);
  pen.fill();
  pen.stroke();
}

function drawBoardLives(x, y) {
  pen.beginPath();
  pen.fillStyle = "#3c6e71";
  pen.strokeStyle = "#284b63";
  pen.lineWidth = "2";
  pen.rect(x, y, 45, 10);
  pen.fill();
  pen.stroke();
}

function mouseHandler(e) {
  const mouseMovement = e.clientX - canvas.offsetLeft;
  const insideCanvas = () =>
    mouseMovement - board.width / 2 > 0 &&
    mouseMovement + board.width / 2 < canvas.width;

  if (insideCanvas()) {
    board.x = mouseMovement - board.width / 2;
  }
}

function loop() {
  //   clearTimeout(game.timeoutId);
  if (!game.paused) {
    paint();
    moveBall();
    ballWall();
    ballBoard();
    // ballBrick();
    ballBrickCollision();
    // if (game.startPrizeSwitch) {
    //   moveLoot();
    // }

    //this check if the level or game is over, then break from animate()
    if (isLevelCompleted() || isGameOver()) return;

    game.requestId = requestAnimationFrame(loop);
  }
}

function paint() {
  pen.drawImage(image, 0, 0);
  drawBoard();
  drawBall();
  drawBricks();
  drawScore();
  drawLives();
  // if (game.incrementPrizeSwitch === "true") {
  drawLoot();
  moveLoot();
  // }
}

function drawScore() {
  pen.font = "24px ArcadeClassic";
  pen.fillStyle = "rgb(59, 99, 230)";
  //destructure score from game object
  const { score } = game;
  //   pen.fillText(`Level: ${level}`, 5, 23);
  pen.fillText(`Score: ${score}`, canvas.width / 2 - 50, 23);
}

function drawLives() {
  if (game.hearts > 3) {
    pen.font = "30px ArcadeClassic";
    pen.fillStyle = "rgb(59, 99, 230)";
    pen.fillText(`${game.hearts}`, canvas.width - 140, 25);

    drawBoardLives(canvas.width - 100, 9);
    return;
  }
  if (game.hearts > 2) {
    drawBoardLives(canvas.width - 150, 9);
  }
  if (game.hearts > 1) {
    drawBoardLives(canvas.width - 100, 9);
  }
  if (game.hearts > 0) {
    drawBoardLives(canvas.width - 50, 9);
  }
  if (game.hearts === 0) {
    pen.drawImage(image, 0, 0);
  }
}

function isGameOver() {
  if (game.hearts === 0) {
    //to remove the last live on screen
    pauseAllSounds();
    sounds.gameFinish.play();
    game.speed = 5;

    drawLives();
    gameOver();
    return true;
  }
}

function checkFinished() {
  let levelFinished = true;

  //if all bricks.status == 0 || 3 then it will return true and wont access the if condition
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      //b.status === 3 is for the unbreakable bricks
      if (b.status != 0 && b.status != 3) {
        levelFinished = false;
        return levelFinished;
      }
    }
  }
  return levelFinished;
}

function isLevelCompleted() {
  const threshold = checkFinished();

  if (threshold) {
    lootArray.splice(0, lootArray.length);

    brick.brickFinished = true;

    pen.drawImage(image, 0, 0);
    initNextLevel();
    // sounds.nextLevel.play();
    resetBall();
    resetBoard();
    resetBricks();

    createBricks();
    game.timeoutId = setTimeout(() => {
      loop();
      sounds.nextLevel.play();
    }, 3000);

    return true;
  }
  return false;
}

function initNextLevel() {
  game.level++;
  game.speed++;

  pen.font = "50px ArcadeClassic";
  pen.fillStyle = "yellow";
  pen.fillText(
    `LEVEL ${game.level}!`,
    canvas.width / 2 - 80,
    canvas.height / 2
  );
}

function gameOver() {
  let highestScore = getHighestScore();

  pen.font = "50px Verdana";
  pen.fillStyle = "red";
  pen.fillText("GAME OVER", canvas.width / 2 - 125, canvas.height / 2);
  pen.font = "20px Verdana";
  pen.fillText(
    `Your score ${game.score}`,
    canvas.width / 2 - 125,
    canvas.height / 2 + 60
  );

  if (highestScore === 0) {
    pen.fillText(
      `ZERO POINTS !? you still a nobby`,
      canvas.width / 2 - 125,
      canvas.height / 2 + 120
    );
  } else {
    pen.fillText(
      `Highest score = ${highestScore} `,
      canvas.width / 2 - 125,
      canvas.height / 2 + 120
    );
  }
}

// loop();
function play() {
  document.removeEventListener("keydown", clickHandler);
  pauseAllSounds();
  sounds.onLoadSound.play();
  //remove time out from isLevelCompleted()
  clearTimeout(game.timeoutId);
  //cancelAnimationFrame should run at the start to stop the perviously loaded loops -if any- started by requestAnimationFrame() in previous games, to start fresh the game.
  cancelAnimationFrame(game.requestId);

  sounds.gameStart.play();

  resetGame();
  resetBall();
  resetBoard();
  createBricks();
  //   game.sfx && sounds.breakout.play();
  //   // Start music after starting sound ends.
  //   setTimeout(() => game.music && sounds.music.play(), 2000);
  loop();
}

document.addEventListener("keydown", clickHandler);

function clickHandler(e) {
  if (e.key === "s") {
    play();
  }
}

function updateLocalStorageScore(newScore) {
  let highestScore;
  if (localStorage.getItem("highestScore") === null) {
    //init highestScore,
    highestScore = 0;
  } else {
    //get the old score to increment on
    highestScore = JSON.parse(localStorage.getItem("highestScore"));
  }
  //check if newScore is greater
  if (newScore > highestScore) {
    highestScore = newScore;
  }
  //update local storage
  localStorage.setItem("highestScore", JSON.stringify(highestScore));
}

//returns highestScore from the local storage
function getHighestScore() {
  let currentHighestScore;

  //if no highestScore yet
  if (localStorage.getItem("highestScore") === null) {
    // init highestScore,
    currentHighestScore = 0;
  } else {
    //get the old score to increment on
    currentHighestScore = JSON.parse(localStorage.getItem("highestScore"));
  }
  return currentHighestScore;
}

function pauseAllSounds() {
  sounds.ballHitBrick.currentTime = 0;
  sounds.ballHitBrick.pause();

  sounds.ballHitBoard.currentTime = 0;
  sounds.ballHitBoard.pause();

  sounds.gameStart.currentTime = 0;
  sounds.gameStart.pause();

  sounds.gameFinish.currentTime = 0;
  sounds.gameFinish.pause();

  sounds.nextLevel.currentTime = 0;
  sounds.nextLevel.pause();

  sounds.brickCrack.currentTime = 0;
  sounds.brickCrack.pause();

  sounds.pauseGameSound.currentTime = 0;
  sounds.pauseGameSound.pause();

  sounds.onLoadSound.currentTime = 0;
  sounds.onLoadSound.pause();
}
