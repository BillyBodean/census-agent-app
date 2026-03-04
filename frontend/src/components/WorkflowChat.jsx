import { useState, useEffect } from 'react';
import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { getSessionUrl } from '../api/config';

const CHATKIT_SCRIPT_URL = 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js';

function loadChatKitScript() {
  if (typeof customElements !== 'undefined' && customElements.get('openai-chatkit')) {
    return Promise.resolve();
  }
  const existing = document.querySelector(`script[src="${CHATKIT_SCRIPT_URL}"]`);
  if (existing) {
    return customElements.whenDefined('openai-chatkit');
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHATKIT_SCRIPT_URL;
    script.async = true;
    script.onload = () => customElements.whenDefined('openai-chatkit').then(resolve).catch(reject);
    script.onerror = () => reject(new Error('ChatKit script failed to load. Check the console for CSP or network errors.'));
    document.head.appendChild(script);
  });
}

function WorkflowChatInner() {
  const [sessionError, setSessionError] = useState('');

  const apiConfig = {
    async getClientSecret(_currentClientSecret) {
      setSessionError('');
      const res = await fetch(getSessionUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || `Session failed (${res.status}).`;
        setSessionError(msg);
        throw new Error(msg);
      }
      const { client_secret } = await res.json();
      if (!client_secret) {
        setSessionError('No client secret returned from server.');
        throw new Error('No client secret returned.');
      }
      return client_secret;
    },
  };

  const { control } = useChatKit({
    api: apiConfig,
    onError: (e) => setSessionError(e?.message || 'ChatKit error'),
  });

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>2021 Census Query</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Ask questions about the 2021 Australian Census data. Your workflow is connected via ChatKit.
      </p>
      {sessionError && (
        <div style={{ marginBottom: 16, padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 14 }}>
          {sessionError}
        </div>
      )}
      <div style={{ minHeight: 480, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <ChatKit control={control} />
      </div>
    </div>
  );
}

export default function WorkflowChat() {
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState('');

  useEffect(() => {
    loadChatKitScript()
      .then(() => setScriptReady(true))
      .catch((e) => setScriptError(e?.message || 'ChatKit failed to load'));
  }, []);

  if (scriptError) {
    return (
      <div style={{ maxWidth: 600, margin: '48px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>2021 Census Query</h1>
        <p style={{ color: '#dc2626', marginBottom: 16 }}>{scriptError}</p>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          The chat widget requires the ChatKit script from <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>cdn.platform.openai.com</code>.
          If you see CSP or cookie errors in the console, your browser or network may be blocking the embed. Try another browser or report to{' '}
          <a href="https://help.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>OpenAI Help</a>.
        </p>
      </div>
    );
  }

  if (!scriptReady) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
        Loading chat…
      </div>
    );
  }

  return <WorkflowChatInner />;
}
