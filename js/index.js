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
