import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const True3DCube = ({ size, color, glow }) => {
  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `rgba(${color}, 0.03)`, // very faint fill
    border: `2px solid rgba(${color}, 0.6)`,
    boxShadow: `0 0 20px rgba(${glow}, 0.4), inset 0 0 20px rgba(${glow}, 0.4)`,
  };
  const half = size / 2;

  return (
    <div style={{ width: size, height: size, position: 'relative', transformStyle: 'preserve-3d' }}>
      <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
    </div>
  );
};

const AuthBackground = () => {
  // Generate random 3D cubes
  const palettes = [
    { color: '59, 130, 246', glow: '59, 130, 246' },   // Blue
    { color: '139, 92, 246', glow: '139, 92, 246' }, // Purple
    { color: '6, 182, 212', glow: '6, 182, 212' },   // Cyan
  ];

  // We memoize the cubes so they don't regenerate on re-renders, but since this component
  // rarely re-renders, calculating once per mount is fine.
  const [cubes] = React.useState(() => 
    Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 60 + 40; // 40px to 100px
      return {
        id: i,
        size,
        left: `${Math.random() * 100}vw`,
        delay: Math.random() * -20, 
        duration: Math.random() * 20 + 20, // 20s to 40s
        rotateXDir: Math.random() > 0.5 ? 1 : -1,
        rotateYDir: Math.random() > 0.5 ? 1 : -1,
        palette: palettes[Math.floor(Math.random() * palettes.length)]
      };
    })
  );

  // --- INTERACTIVITY HOOKS ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const zoom = useMotionValue(1);

  // Smooth springs for a fluid, floating "live" feel
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const smoothZoom = useSpring(zoom, { stiffness: 100, damping: 20 });

  // Transform mouse position to 3D rotation (-15deg to 15deg)
  const rotateX = useTransform(smoothMouseY, [-1, 1], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position between -1 and 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    const handleWheel = (e) => {
      // Zoom in/out based on wheel scroll delta
      let newZoom = zoom.get() - e.deltaY * 0.002;
      // Clamp zoom between 0.5 (far away) and 4 (very close)
      if (newZoom < 0.5) newZoom = 0.5;
      if (newZoom > 4) newZoom = 4;
      zoom.set(newZoom);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [mouseX, mouseY, zoom]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'auto', // Needs auto to capture wheel events on the background if empty
      background: 'radial-gradient(circle at center, #0a1930 0%, #030712 100%)'
    }}>
      
      {/* Interactive 3D Scene Container */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          scale: smoothZoom,
          rotateX: rotateX,
          rotateY: rotateY
        }}
      >
        {cubes.map((cube) => (
          <motion.div
            key={cube.id}
            initial={{ 
              y: '120vh', 
              x: cube.left,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              y: '-30vh',
              rotateX: 360 * cube.rotateXDir,
              rotateY: 360 * cube.rotateYDir,
              rotateZ: 180,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5]
            }}
            transition={{ 
              duration: cube.duration, 
              repeat: Infinity, 
              delay: cube.delay,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: cube.size,
              height: cube.size,
              transformStyle: 'preserve-3d'
            }}
          >
            <True3DCube size={cube.size} color={cube.palette.color} glow={cube.palette.glow} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AuthBackground;
