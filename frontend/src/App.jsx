import { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import WorkflowChat from './components/WorkflowChat';
import { getConfig } from './api/config';

export default function App() {
  const [mode, setMode] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getConfig()
      .then(({ mode: m }) => setMode(m))
      .catch((err) => setError(err.message || 'Failed to load app.'));
  }, []);

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 24, fontFamily: 'system-ui', color: '#dc2626' }}>
        <h1>Unable to load</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (mode === null) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 24, fontFamily: 'system-ui', color: '#64748b' }}>
        Loading…
      </div>
    );
  }

  if (mode === 'workflow') {
    return <WorkflowChat />;
  }

  return <ChatBox />;
}
