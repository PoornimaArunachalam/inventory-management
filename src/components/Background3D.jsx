import React, { useEffect, useRef } from 'react';

const Background3D = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Configuration
    const orbCount = 60;
    const orbs = [];
    
    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Mouse handler
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial orbs
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1.5 + 0.1, // 0.1 to 1.6 depth
        radius: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? '#3B82F6' : '#60A5FA' // Light Blue Theme colors
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(orb => {
        // Base movement
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Mouse Parallax (based on depth Z)
        const displayX = orb.x + (mouseRef.current.x * orb.z);
        const displayY = orb.y + (mouseRef.current.y * orb.z);

        // Screen wrap
        if (orb.x < -100) orb.x = canvas.width + 100;
        if (orb.x > canvas.width + 100) orb.x = -100;
        if (orb.y < -100) orb.y = canvas.height + 100;
        if (orb.y > canvas.height + 100) orb.y = -100;

        // Draw Glow
        const gradient = ctx.createRadialGradient(
          displayX, displayY, 0,
          displayX, displayY, orb.radius * 12 * orb.z
        );
        
        const opacity = (0.05 + (orb.z / 3)) * 0.4;
        gradient.addColorStop(0, orb.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(displayX, displayY, orb.radius * 12 * orb.z, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Core
        ctx.fillStyle = orb.color + '22';
        ctx.beginPath();
        ctx.arc(displayX, displayY, orb.radius * orb.z, 0, Math.PI * 2);
        ctx.fill();
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
          zIndex: -1,
          pointerEvents: 'none',
          background: '#eff6ff', // Light Blue Theme
        }} 
      />
    );
};

export default Background3D;
