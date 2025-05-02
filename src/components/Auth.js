import React, { useState } from 'react';
import { supabase } from '../supabase';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const handleEmailSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setAuthMessage('Signing in...');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear form after successful sign-in
      setEmail('');
      setPassword('');
    } catch (error) {
      setAuthMessage(error.error_description || error.message);
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setAuthMessage('Creating account...');

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setAuthMessage('Check your email for the confirmation link!');

      // Clear form after successful sign-up
      setEmail('');
      setPassword('');
    } catch (error) {
      setAuthMessage(error.error_description || error.message);
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthMessage('Redirecting to Google...');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setAuthMessage(error.error_description || error.message);
      console.error('Google sign in error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Notes App</h1>
      <p>Sign in to access your notes</p>

      {authMessage && (
        <div className={`auth-message ${authMessage.includes('error') ? 'error' : ''}`}>
          {authMessage}
        </div>
      )}

      <form onSubmit={handleEmailSignIn}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="auth-buttons">
          <button
            type="submit"
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>

          <button
            type="button"
            className="button-secondary"
            onClick={handleEmailSignUp}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>

      <div className="social-auth">
        <hr />
        <p>Or sign in with</p>
        <button
          onClick={handleGoogleSignIn}
          className="google-button"
          disabled={loading}
        >
          <span className="google-icon">G</span>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
