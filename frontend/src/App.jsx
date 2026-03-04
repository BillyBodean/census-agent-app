import { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import WorkflowChat from './components/WorkflowChat';
import { getConfig } from './api/config';

export default function App() {
  const [mode, setMode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getConfig()
      .then((c) => setMode(c.mode))
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <p style={{ marginTop: 8, color: '#64748b' }}>
          Using simple ask box. Set VITE_API_URL and ensure the backend is running.
        </p>
        <ChatBox />
      </div>
    );
  }

  if (mode === 'workflow') {
    return <WorkflowChat />;
  }

  if (mode === null) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
        Loading…
      </div>
    );
  }

  return <ChatBox />;
}
