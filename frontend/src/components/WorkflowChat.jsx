import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { getSessionUrl, getChatKitApiUrl } from '../api/config';

const domainKey = import.meta.env.VITE_CHATKIT_DOMAIN_KEY?.trim() || '';

function WorkflowChatInner() {
  const apiConfig = domainKey
    ? { url: getChatKitApiUrl(), domainKey }
    : {
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
    </div>
  );
}

export default function WorkflowChat() {
  return <WorkflowChatInner />;
}
