import { useEffect, useRef } from 'react';
import { playerImage } from '../util/spriteLogic';

export default function Game() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

   

    // Drawing and game logic here
    const player = {
      x: canvas.width / 10,
      y: canvas.height / 10,
      speed: 10
    };

    const handleKeyDown = (event) => {
      const { key } = event;

      if (key === 'ArrowUp' || key === 'w') {
        player.y -= player.speed;
      } else if (key === 'ArrowDown' || key === 's') {
        player.y += player.speed;
      } else if (key === 'ArrowLeft' || key === 'a') {
        player.x -= player.speed;
      } else if (key === 'ArrowRight' || key === 'd') {
        player.x += player.speed;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // game loop
    // The sprite image frame starts from 0
    let currentFrame = 0;
    const gameLoop = setInterval(() => {
      // Pick a new frame
      // currentFrame++;

      // // Make the frames loop
      // let maxFrame = numColumns * numRows - 1;
      // if (currentFrame > maxFrame){
      //     currentFrame = 0;
      // }

      // Update rows and columns
      // let column = currentFrame % numColumns;
      // let row = Math.floor(currentFrame / numColumns);
      
      // drawPlayer(playerImage, 10, 30, frameWidth, frameHeight);
    }, 1000 / 60);

    return () => {
      // Clean up or remove event listeners if needed
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, []);

  return (
    <div>
      <canvas className="w-full h-full bg-white mt-[-25px]" ref={canvasRef} width={1000} height={800} />
    </div>
  );
}
