import { useState } from 'react'
import TypingBox from '../components/TypingBox'
import { getRandomSnippet } from '../data/snippets'

export default function PracticePage() {
  const [text, setText] = useState(() => getRandomSnippet())

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Practice</h2>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setText(getRandomSnippet(text))}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        >
          New text
        </button>
      </div>
      <TypingBox key={text} text={text} />
    </div>
  )
}
