import { useState } from 'react';
import { askQuestion } from '../api/ask';

export default function ChatBox() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>2021 Census Query</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Ask a question about the 2021 Australian Census data.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How many people live in NSW?"
          rows={3}
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 12,
            padding: '10px 28px',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: loading ? '#93c5fd' : '#2563eb',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: 20,
          padding: 14,
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          color: '#dc2626',
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {answer && (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          fontSize: 15,
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}
