import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function AuthModal({ isOpen, onClose, mode, setMode, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
        } else {
          setError('');
          onSuccess();
          onClose();
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
        } else {
          setError('');
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <span onClick={() => setMode('signup')} className="modal-switch-link">
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setMode('login')} className="modal-switch-link">
                Login
              </span>
            </>
          )}
        </p>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
