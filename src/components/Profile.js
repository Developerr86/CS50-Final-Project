import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Profile = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-email">
        <p><strong>Email:</strong> {session.user.email}</p>
      </div>
      
      <form onSubmit={updateProfile} className="profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
