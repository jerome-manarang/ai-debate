import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient'; // Import Supabase client
import TitlePage from './components/TitlePage';
import TopicPage from './components/TopicPage';
import ChatBox from './components/ChatBox';
import AuthModal from './components/AuthModal';

function App() {
  const [started, setStarted] = useState(false); // Track if the game has started
  const [topicSelected, setTopicSelected] = useState(false); // Track if a topic is selected
  const [topic, setTopic] = useState('');
  const [session, setSession] = useState(null); // Track session (user login state)
  const [currentPage, setCurrentPage] = useState('title'); // Track current page
  const [authModalOpen, setAuthModalOpen] = useState(false); // Track modal open state
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session); // Set the session if user is logged in
    };

    fetchSession();

    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          setCurrentPage('topic'); // Redirect to TopicPage on login
        }
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe(); // Proper cleanup
      }
    };
  }, []);

  // Start the game when "Play without account" is clicked
  const handleStart = () => {
    setStarted(true);
    setCurrentPage('topic'); // Go directly to TopicPage
  };

  const handleTopicSubmit = (selectedTopic) => {
    setTopic(selectedTopic);
    setTopicSelected(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentPage('title'); // Redirect to TitlePage on sign out
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Render based on the current page and state
  return (
    <div>
      {currentPage === 'title' && (
        <TitlePage
          onStart={handleStart}
          onLogin={() => openAuthModal('login')}
          onSignUp={() => openAuthModal('signup')}
        />
      )}

      {currentPage === 'topic' && (
        <>
          {session && <button onClick={handleSignOut}>Sign Out</button>}

          {!topicSelected ? (
            <TopicPage onSubmit={handleTopicSubmit} />
          ) : (
            <ChatBox topic={topic} />
          )}
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={() => setCurrentPage('topic')}
      />
    </div>
  );
}

export default App;
