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