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
