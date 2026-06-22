import React, { useState } from 'react';
import { C } from '../constants';
import { supabase } from '../utils/supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentSessionUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (signInError) throw signInError;
        if (data.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.signOut(); // wait, supabaseClient.js exports supabase client, is signout under auth or client?
      // In @supabase/supabase-js v2, signOut is supabase.auth.signOut()
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      onAuthSuccess(null);
      onClose();
    } catch (err) {
      setError('Failed to log out: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(28, 28, 26, 0.4)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, width: '100%', maxWidth: 400,
        padding: '28px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: 'none', fontSize: 16, color: C.muted, cursor: 'pointer',
          padding: 4
        }}>✕</button>

        {currentSessionUser ? (
          <div>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>☁️</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, textAlign: 'center', marginBottom: 6 }}>
              Connected to Cloud
            </h2>
            <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 20 }}>
              Logged in as:<br/>
              <strong style={{ color: C.text }}>{currentSessionUser.email}</strong>
            </p>
            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0', background: C.danger, color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>☁️</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, textAlign: 'center', marginBottom: 4 }}>
              {isSignUp ? 'Create Cloud Account' : 'Sync to Cloud'}
            </h2>
            <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 20, lineHeight: 1.5 }}>
              {isSignUp 
                ? 'Register to save and sync your trips across all devices in real-time.' 
                : 'Sign in to access your saved trips from anywhere.'}
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: 1.2 }}>EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none',
                  width: '100%', fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: 1.2 }}>PASSWORD</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '10px 12px', color: C.text, fontSize: 13, outline: 'none',
                  width: '100%', fontFamily: 'inherit'
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${C.danger}33`, borderRadius: 8, padding: '10px 12px', fontSize: 12, color: C.danger, marginBottom: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div style={{ background: C.accentLight, border: `1px solid ${C.accentSoft}33`, borderRadius: 8, padding: '10px 12px', fontSize: 12, color: C.accent, marginBottom: 14 }}>
                ✓ {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0', background: C.accent, color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800,
                cursor: 'pointer', transition: 'opacity 0.2s', marginBottom: 14,
                boxShadow: `0 4px 12px rgba(45,106,79,0.2)`
              }}
            >
              {loading ? 'Syncing...' : isSignUp ? 'Create Account' : 'Sign In & Sync'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12 }}>
              <span style={{ color: C.muted }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
                style={{
                  background: 'none', border: 'none', color: C.accent, cursor: 'pointer',
                  fontWeight: 700, padding: 0, fontSize: 'inherit'
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
