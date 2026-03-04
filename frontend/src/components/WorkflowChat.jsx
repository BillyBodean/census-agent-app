import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { getSessionUrl } from '../api/config';

export default function WorkflowChat() {
  const { control } = useChatKit({
    api: {
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
    },
  });

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>2021 Census Query</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Ask questions about the 2021 Australian Census data. Your workflow agent is connected.
      </p>
      <ChatKit control={control} />
    </div>
  );
}
