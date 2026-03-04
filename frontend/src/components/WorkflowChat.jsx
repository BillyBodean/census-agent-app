import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { getSessionUrl } from '../api/config';

function WorkflowChatInner() {
  const apiConfig = {
    async getClientSecret(_currentClientSecret) {
      const res = await fetch(getSessionUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start chat session.');
      }
      const { client_secret } = await res.json();
      return client_secret;
    },
  };

  const { control } = useChatKit({ api: apiConfig });

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>2021 Census Query</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Ask questions about the 2021 Australian Census data. Your workflow agent is connected.
      </p>
      <div style={{ minHeight: 480, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <ChatKit control={control} />
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
        If you see an empty box or CSP/cookie errors in the console, the ChatKit embed may be blocked by a known issue on OpenAI’s CDN. Report it at{' '}
        <a href="https://help.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>OpenAI Help</a> or try again later.
      </p>
    </div>
  );
}

export default function WorkflowChat() {
  return <WorkflowChatInner />;
}
