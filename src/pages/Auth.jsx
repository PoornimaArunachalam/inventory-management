import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, LogIn, UserPlus, Box } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'worker' });
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
        result = await login(formData.email, formData.password, formData.role);
      } else {
        result = await signup(formData.username, formData.email, formData.password, formData.role);
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
        background: '#0b101c',
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
        <div className="auth-card" style={{
          width: 'min(450px, 90vw)',
          padding: '3rem 2.5rem',
          position: 'relative',
          zIndex: 10,
          background: '#1a2035',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
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
                background: 'linear-gradient(135deg, #7b2cbf, #4cc9f0)',
                borderRadius: '18px',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                boxShadow: '0 8px 30px rgba(123, 44, 191, 0.6)',
                transform: 'translateZ(50px)'
              }}
            >
              <div style={{
                fontWeight: '900',
                fontSize: '2rem',
                transform: 'rotate(-5deg)',
                letterSpacing: '-1px'
              }}>S&R</div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#4a90e2' }}
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
                <>
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
                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                      />
                    </div>
                  </motion.div>

                </>
              )}
            </AnimatePresence>

            <motion.div
              key="role-selector"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                {['worker', 'admin'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: formData.role === r ? 'var(--accent-blue)' : 'transparent',
                      color: formData.role === r ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: formData.role === r ? '0 4px 15px rgba(0, 210, 255, 0.2)' : 'none'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  name="email" type="email" required placeholder="Email Address"
                  value={formData.email} onChange={handleChange}
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password"
                  value={formData.password} onChange={handleChange}
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', color: 'white', outline: 'none' }}
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
              type="submit" disabled={loading}
              style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: '800', marginTop: '0.5rem', background: '#4a90e2', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(74, 144, 226, 0.3)' }}
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <> {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={18} strokeWidth={2.5} /> </>
              )}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              {isLogin ? <>Don't have an account? <span style={{ color: '#4a90e2', fontWeight: '700' }}>Sign up</span></> : <>Already have an account? <span style={{ color: '#4a90e2', fontWeight: '700' }}>Log in</span></>}
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
            <Box size={16} style={{ color: '#4a90e2', marginBottom: '0.75rem', opacity: 0.6 }} />
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

          {/* Credits Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{
              marginTop: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              lineHeight: '1.6',
            }}>
              Designed and developed by Poornima A <br/>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                <a 
                  href="https://www.linkedin.com/in/poornima-a-288a54282" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '40px', 
                      height: '40px', 
                      background: '#4a90e2', 
                      border: 'none', 
                      borderRadius: '10px', 
                      color: 'white', 
                      textDecoration: 'none', 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(74, 144, 226, 0.5)';
                    }} 
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 144, 226, 0.3)';
                    }}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
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
