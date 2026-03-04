import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { getSessionUrl } from '../api/config';

const domainKey = import.meta.env.VITE_CHATKIT_DOMAIN_KEY?.trim() || '';

function WorkflowChatInner() {
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
      domainKey,
    },
  });

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
  if (!domainKey) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 24, fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>ChatKit domain key required</h1>
        <p style={{ color: '#64748b', marginBottom: 16 }}>
          Add your domain in the OpenAI domain allowlist, then set the generated <strong>domain key</strong> (public key) as the environment variable <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>VITE_CHATKIT_DOMAIN_KEY</code> in Vercel (or in <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>.env.production</code>), then redeploy the frontend.
        </p>
        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          Domain allowlist: OpenAI dashboard → Organization → Security → Domain allowlist
        </p>
      </div>
    );
  }

  return <WorkflowChatInner />;
}
