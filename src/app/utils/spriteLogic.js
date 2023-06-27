const frameWidth = 96;
const frameHeight = 97;
const beginX = 135;
const beginY = 96;
const frameOffset = 1017;

const playerImageIdOffsetX = [0, 110];
const playerImageIdOffsetY = [0, 0, 134, 134, 268, 268, 396, 396, 530, 530];

const playerLeftOffsetX = [
  [0, -3, 0, 10],
  [-5, 6, 0, -6],
  [0, 0, 0, 8],
  [0, 4, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 0, 16],
  [6, 16, 0, 6],
];

const playerLeftOffsetY = [
  [0, -5, -5, -5],
  [0, -8, 0, -2],
  [0, 0, -4, 0],
  [0, -4, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const playerImage = new Image();
playerImage.src = "/sprites-sheet.png";

const background = new Image();
background.src = "/grass.png";

const drawBackground = (context, canvas) => {
  if (background.complete) {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
};

const drawPlayer = (context, canvas, playerImageId, dir, currentFrame, x, y, width, height) => {
  let horizontalOffset = 0;
  let horizontalFrameOffset = 0;
  let verticalFrameOffset = 0;

  switch (dir) {
    case "left":
      horizontalOffset = 757;
      break;
    case "right":
      horizontalOffset = 0;
      break;
    case "up":
      horizontalOffset = 549;
      break;
    case "down":
      horizontalOffset = 277;
      break;
  }

  if (dir === "left") {
    horizontalFrameOffset = playerLeftOffsetX[playerImageId][currentFrame];
    verticalFrameOffset = playerLeftOffsetY[playerImageId][currentFrame];
  }

  context.drawImage(
    playerImage,
    beginX + frameOffset * currentFrame + horizontalOffset + horizontalFrameOffset + playerImageIdOffsetX[playerImageId % 2],
    beginY + verticalFrameOffset + playerImageIdOffsetY[playerImageId],
    frameWidth,
    frameHeight,
    x,
    y,
    width,
    height
  );
};

export { drawBackground, drawPlayer };