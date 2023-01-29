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
