const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

const pause = document.getElementById("pause-button");

const image = new Image();
image.src = "images/white.webp";
const BRICK_IMG = new Image();
BRICK_IMG.src = "images/Capture.PNG";
const CRACKED_IMG = new Image();
CRACKED_IMG.src = "images/crackedPNG.PNG";

//increment for each brick broken.
const boardWidth = 90;
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
  sounds.onLoadSound.play();

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
  // sounds.pauseGameSound.currentTime = 0; //like stopping the sound if any
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

  music: true,
  sfx: true,
};

function resetGame() {
  game.speed = 10;
  game.hearts = 3;
  game.requestId = null;
  game.score = 0;
  game.level = 0;
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
    column: 2,
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
  createBricks();
  
  function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
      for (let c = 0; c < brick.column; c++) {
        let b = bricks[r][c];
        if (b.status === 2) {
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
    }
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
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
            b.status--;
            if (b.status === 0) {
              sounds.brickCrack.play();
            } else {
              sounds.ballHitBrick.play();
            }
            brick.brickHits++;
            game.score += game.scoreGain;
          }
        }
      }
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