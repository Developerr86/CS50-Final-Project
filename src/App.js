import React, {useState, useEffect} from 'react';
import { supabase } from './supabase';
import './App.css';
import Auth from './components/Auth';
import Profile from './components/Profile';

function App() {
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingTimeouts, setLoadingTimeouts] = useState(0);
  const [forceLogout, setForceLogout] = useState(false);
  const [stableUI, setStableUI] = useState(false);

  // Effect to stabilize UI after successful login
  useEffect(() => {
    if (session && !loading) {
      console.log('Session active and not loading, preparing to stabilize UI');
      // Wait a bit before marking the UI as stable
      const stabilizeTimeout = setTimeout(() => {
        console.log('Stabilizing UI now');
        setStableUI(true);
      }, 1500); // Increased to 1.5 seconds for better stability

      return () => clearTimeout(stabilizeTimeout);
    } else if (!session) {
      // Reset stable UI when logged out
      console.log('No session, resetting stable UI state');
      setStableUI(false);
    }
  }, [session, loading]);

  // Reset stable UI when loading state changes to true
  useEffect(() => {
    if (loading) {
      console.log('Loading started, resetting stable UI');
      setStableUI(false);
    }
  }, [loading]);

  useEffect(() => {
    // Safety timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout triggered - forcing loading state to false');
        setLoading(false);

        // Increment the timeout counter
        const newTimeoutCount = loadingTimeouts + 1;
        setLoadingTimeouts(newTimeoutCount);

        console.log(`Loading timeout #${newTimeoutCount} occurred`);

        // After 2 timeouts, force logout
        if (newTimeoutCount >= 2) {
          console.log('Two timeouts occurred - forcing logout');
          setForceLogout(true);
          // Reset the counter
          setLoadingTimeouts(0);
        }
      }
    }, 5000); // 5 second timeout

    // Get current session
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session ? 'User is logged in' : 'No user logged in');
        setSession(session);
        if (session) {
          await fetchNotes(session);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session ? 'User session found' : 'No user session');
      setSession(session);

      if (session) {
        setLoading(true);
        try {
          await fetchNotes(session);
        } catch (error) {
          console.error('Error fetching notes after auth change:', error);
          setLoading(false);
        }
      } else {
        // No session, ensure we're not loading
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [loading, loadingTimeouts]); // Include loading and loadingTimeouts in the dependency array

  // Define fetchNotes outside of useEffect to avoid dependency issues
  const fetchNotes = async (currentSession = session) => {
    console.log('fetchNotes called with session:', currentSession ? 'valid session' : 'no session');

    if (!currentSession) {
      console.log('No session available, cannot fetch notes');
      setLoading(false); // Ensure loading is set to false even if there's no session
      return;
    }

    console.log('Fetching notes for user:', currentSession.user.id);

    try {
      // Add a small delay to ensure Supabase connection is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', currentSession.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        setLoading(false); // Ensure loading is set to false on error
        return;
      }

      console.log('Notes fetched successfully:', data ? data.length : 0, 'notes found');
      setNotes(data || []);
    } catch (error) {
      console.error('Exception while fetching notes:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false); // Always ensure loading is set to false
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !session) return;

    if (editId) {
      // Update existing note
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', editId)
        .eq('user_id', session.user.id);

      if (error) console.error('Error updating note:', error);
      setEditId(null);
    } else {
      const { error } = await supabase
        .from('notes')
        .insert([{
          title,
          content,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }]);

      if (error) console.error('Error creating note:', error);
    }

    setTitle('');
    setContent('');
    fetchNotes();
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  const handleDelete = async (id) => {
    if (!session) return;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) console.error('Error deleting note:', error);
    fetchNotes();
  };

  const handleSignOut = async () => {
    setStableUI(false); // Reset stable UI before signing out
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setNotes([]);
    setShowProfile(false);
    setForceLogout(false); // Reset force logout state
    setLoadingTimeouts(0); // Reset timeout counter
  };

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : forceLogout ? (
        <div className="error-container">
          <h2>Connection Issue Detected</h2>
          <p>We're having trouble loading your notes. Please sign out and sign back in.</p>
          <button
            onClick={handleSignOut}
            className="signout-button"
          >
            Sign Out
          </button>
        </div>
      ) : loading || !stableUI ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your notes...</p>
          {loadingTimeouts === 1 && (
            <p className="loading-warning">Taking longer than expected...</p>
          )}
        </div>
      ) : (
        <div className="fade-in">
          <div className="app-header">
            <h1>Note Taking App</h1>
            <div className="user-controls">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="profile-button"
              >
                {showProfile ? 'Back to Notes' : 'Profile'}
              </button>
              <button
                onClick={handleSignOut}
                className="signout-button"
              >
                Sign Out
              </button>
            </div>
          </div>

          {showProfile ? (
            <Profile session={session} />
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">{editId ? 'Update' : 'Add'} Note</button>
              </form>

              <div className="notes-list">
                {notes.length === 0 ? (
                  <p className="no-notes">No notes yet. Create your first note!</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="note">
                      <h2>{note.title}</h2>
                      <p>{note.content}</p>
                      {note.created_at && (
                        <div className="note-timestamp">
                          Created: {new Date(note.created_at).toLocaleString()}
                        </div>
                      )}
                      <div className="note-actions">
                        <button onClick={() => handleEdit(note)}>Edit</button>
                        <button onClick={() => handleDelete(note.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;