// Define the number of columns and rows in the sprite
let numColumns = 5;
let numRows = 2;

// Define the size of a frame
let frameWidth = 50;
let frameHeight = 50;

const playerImage = new Image();
playerImage.src = "/sprites-sheet.png";

const background = new Image();
background.src = "/grass.png";

const drawBackground = (context, canvas) => {
  if(background.complete) { // Ensure the image has been loaded
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
}

const drawPlayer = (context, canvas, playerImageId, x, y, width, height) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(context, canvas);
  context.drawImage(playerImage, x, y, width, height);
};

export { drawPlayer };
