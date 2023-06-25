import { useEffect, useRef } from 'react';

export default function Game() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Drawing and game logic here
    const player = {
      x: canvas.width / 10,
      y: canvas.height / 10,
      speed: 50
    };

    const playerImage = new Image();
    playerImage.src = "/pika-pix.gif";

    const background = new Image();
    background.src = "/grass.png";

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

    const drawPlayer = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if(background.complete) { // Ensure the image has been loaded
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
      }
      context.drawImage(playerImage, player.x, player.y, 50, 50);
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const gameLoop = setInterval(() => {
      drawPlayer();
    }, 1000 / 600);

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
