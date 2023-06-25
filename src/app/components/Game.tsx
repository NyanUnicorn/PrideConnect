import { useRef } from 'react';

export default function Game() {
  const canvasRef = useRef(null);
  return (
    <div className="w-full h-full bg-blue-500 mt-[-25px]">
      <canvas ref={canvasRef} width={1000} height={800} />
    </div>
  );
}
