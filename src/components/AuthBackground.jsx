import React, { useEffect, useRef } from 'react';

const AuthBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const boxes = [];
    const boxCount = 25;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) / 100,
        y: (e.clientY - window.innerHeight / 2) / 100
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial boxes
    for (let i = 0; i < boxCount; i++) {
      boxes.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        speedZ: -Math.random() * 2 - 1,
        color: Math.random() > 0.5 ? '#9D50FF' : '#E100FF'
      });
    }

    const project = (x, y, z) => {
      const perspective = 600;
      const scale = perspective / (perspective + z);
      return {
        x: (x * scale) + canvas.width / 2,
        y: (y * scale) + canvas.height / 2,
        scale
      };
    };

    const drawBox = (box) => {
      const p = project(box.x + mouseRef.current.x * 20, box.y + mouseRef.current.y * 20, box.z);
      if (p.scale <= 0) return;

      const size = box.size * p.scale;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(box.rotation);
      
      // Box Wireframe
      ctx.strokeStyle = box.color + Math.floor(p.scale * 150).toString(16).padStart(2, '0');
      ctx.lineWidth = 1.5 * p.scale;
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      
      // Accent corners
      ctx.fillStyle = box.color;
      ctx.globalAlpha = p.scale * 0.3;
      ctx.fillRect(-size / 2 - 2, -size / 2 - 2, 4, 4);
      ctx.fillRect(size / 2 - 2, -size / 2 - 2, 4, 4);
      ctx.fillRect(-size / 2 - 2, size / 2 - 2, 4, 4);
      ctx.fillRect(size / 2 - 2, size / 2 - 2, 4, 4);

      // Glow 
      ctx.shadowBlur = 15 * p.scale;
      ctx.shadowColor = box.color;
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      
      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = '#0F071A'; // Deep Midnight
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sort boxes by Z (painter's algorithm)
      boxes.sort((a, b) => b.z - a.z);

      boxes.forEach(box => {
        box.z += box.speedZ;
        box.rotation += box.rotationSpeed;

        if (box.z < -400) {
          box.z = 2000;
          box.x = (Math.random() - 0.5) * 2000;
          box.y = (Math.random() - 0.5) * 2000;
        }

        drawBox(box);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }} 
    />
  );
};

export default AuthBackground;
