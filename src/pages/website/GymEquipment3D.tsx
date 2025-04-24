
import { useEffect, useRef, useState } from "react";

type EquipmentType = "dumbbell" | "barbell" | "kettlebell" | "proteinShake";

interface GymEquipment3DProps {
  type: EquipmentType;
  className?: string;
  rotationSpeed?: number;
}

const GymEquipment3D = ({ 
  type, 
  className = "", 
  rotationSpeed = 1 
}: GymEquipment3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Rotate
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      
      // Draw based on equipment type
      switch (type) {
        case "dumbbell":
          drawDumbbell(ctx, 0, 0, canvas.width * 0.4);
          break;
        case "barbell":
          drawBarbell(ctx, 0, 0, canvas.width * 0.4);
          break;
        case "kettlebell":
          drawKettlebell(ctx, 0, 0, canvas.width * 0.3);
          break;
        case "proteinShake":
          drawProteinShake(ctx, 0, 0, canvas.width * 0.25);
          break;
      }
      
      ctx.restore();
      
      angle += 0.01 * rotationSpeed;
      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isVisible, type, rotationSpeed]);

  const drawDumbbell = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    const handleLength = size * 0.6;
    const weightRadius = size * 0.2;
    const handleWidth = size * 0.1;
    
    // Create gradient for metallic look
    const gradient = ctx.createLinearGradient(
      x - size/2, y, x + size/2, y
    );
    gradient.addColorStop(0, '#444');
    gradient.addColorStop(0.5, '#AAA');
    gradient.addColorStop(1, '#444');
    
    // Draw handle
    ctx.fillStyle = gradient;
    ctx.fillRect(x - handleLength/2, y - handleWidth/2, handleLength, handleWidth);
    
    // Draw weights
    ctx.beginPath();
    ctx.arc(x - handleLength/2, y, weightRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x + handleLength/2, y, weightRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawBarbell = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    const barLength = size * 1.5;
    const plateWidth = size * 0.1;
    const plateRadius = size * 0.3;
    const handleWidth = size * 0.05;
    
    // Create gradient for metallic look
    const gradient = ctx.createLinearGradient(
      x - barLength/2, y, x + barLength/2, y
    );
    gradient.addColorStop(0, '#444');
    gradient.addColorStop(0.5, '#AAA');
    gradient.addColorStop(1, '#444');
    
    // Draw bar
    ctx.fillStyle = gradient;
    ctx.fillRect(x - barLength/2, y - handleWidth/2, barLength, handleWidth);
    
    // Draw weight plates
    ctx.fillStyle = '#F59E0B'; // Yellow plates
    
    // Left plates
    ctx.beginPath();
    ctx.rect(x - barLength/2 - plateWidth, y - plateRadius, plateWidth, plateRadius * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.rect(x - barLength/2 - plateWidth*2, y - plateRadius*0.8, plateWidth, plateRadius * 1.6);
    ctx.fill();
    
    // Right plates
    ctx.beginPath();
    ctx.rect(x + barLength/2, y - plateRadius, plateWidth, plateRadius * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.rect(x + barLength/2 + plateWidth, y - plateRadius*0.8, plateWidth, plateRadius * 1.6);
    ctx.fill();
  };

  const drawKettlebell = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    const baseRadius = size * 0.4;
    const handleHeight = size * 0.3;
    const handleWidth = size * 0.25;
    
    // Draw base (sphere)
    const gradient = ctx.createRadialGradient(
      x, y + baseRadius*0.2, 0,
      x, y + baseRadius*0.2, baseRadius
    );
    gradient.addColorStop(0, '#444');
    gradient.addColorStop(1, '#222');
    
    ctx.beginPath();
    ctx.arc(x, y + baseRadius*0.2, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw handle
    ctx.beginPath();
    ctx.ellipse(x, y - handleHeight/2, handleWidth/2, handleHeight/2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw top connection
    ctx.beginPath();
    ctx.rect(x - handleWidth*0.2, y - handleHeight, handleWidth*0.4, handleHeight*0.5);
    ctx.fillStyle = '#333';
    ctx.fill();
  };

  const drawProteinShake = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    const bottleHeight = size * 1.5;
    const bottleWidth = size * 0.7;
    const capHeight = size * 0.2;
    const capWidth = size * 0.4;
    
    // Draw bottle body
    const gradient = ctx.createLinearGradient(
      x, y - bottleHeight/2, x, y + bottleHeight/2
    );
    gradient.addColorStop(0, '#222');
    gradient.addColorStop(0.4, '#F59E0B'); // Yellow protein
    gradient.addColorStop(1, '#222');
    
    // Bottle
    ctx.beginPath();
    ctx.roundRect(
      x - bottleWidth/2, 
      y - bottleHeight/2 + capHeight, 
      bottleWidth, 
      bottleHeight - capHeight,
      [0, 0, bottleWidth/4, bottleWidth/4] // Rounded bottom corners
    );
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Cap
    ctx.beginPath();
    ctx.roundRect(
      x - capWidth/2,
      y - bottleHeight/2,
      capWidth,
      capHeight,
      [capWidth/4, capWidth/4, 0, 0] // Rounded top corners
    );
    ctx.fillStyle = '#444';
    ctx.fill();
    
    // Label
    ctx.beginPath();
    ctx.roundRect(
      x - bottleWidth*0.4,
      y - bottleHeight*0.1,
      bottleWidth*0.8,
      bottleHeight*0.4,
      5
    );
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className} ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default GymEquipment3D;
