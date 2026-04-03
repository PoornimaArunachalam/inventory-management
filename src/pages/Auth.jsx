import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, LogIn, UserPlus, Box } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.username, formData.email, formData.password);
      }
      if (!result.success) setError(result.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#0F071A',
        overflow: 'hidden',
        perspective: '1000px'
      }}
    >
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="glass auth-card" style={{
          width: 'min(450px, 90vw)',
          padding: '3rem 2.5rem',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--glass-border)',
          transform: 'translateZ(20px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-glow))',
                borderRadius: '20px',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(157, 80, 255, 0.5)',
                transform: 'translateZ(50px)'
              }}
            >
              {isLogin ? <LogIn size={36} /> : <UserPlus size={36} />}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="gradient-text" 
              style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}
            >
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}
            >
              {isLogin ? 'Enter your credentials to enter the vault' : 'Create an account to start your journey'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                >
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      name="username" type="text" required placeholder="Full Name"
                      value={formData.username} onChange={handleChange}
                      style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  name="email" type="email" required placeholder="Email Address"
                  value={formData.email} onChange={handleChange}
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password"
                  value={formData.password} onChange={handleChange}
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading} className="btn-primary"
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.5rem' }}
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <> {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={20} /> </>
              )}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              {isLogin ? <>Don't have an account? <span style={{ color: 'var(--accent-purple)', fontWeight: '700' }}>Sign up</span></> : <>Already have an account? <span style={{ color: 'var(--accent-purple)', fontWeight: '700' }}>Log in</span></>}
            </button>
          </motion.div>

          {/* New Website Quote Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ 
              marginTop: '2.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center'
            }}
          >
            <Box size={16} style={{ color: 'var(--accent-purple)', marginBottom: '0.75rem', opacity: 0.6 }} />
            <p style={{ 
              fontStyle: 'italic', 
              color: 'var(--text-secondary)', 
              fontSize: '0.8rem', 
              lineHeight: '1.6',
              maxWidth: '80%',
              margin: '0 auto'
            }}>
              "Inventory is not just stock; it's the rhythm of your business. Master the beat with <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>STOCK & ROLL</span>."
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Auth;
