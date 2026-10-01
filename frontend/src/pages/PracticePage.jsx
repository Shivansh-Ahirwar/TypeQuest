import TypingBox from '../components/TypingBox'

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.'

export default function PracticePage() {
  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Practice</h2>
      <TypingBox text={SAMPLE_TEXT} />
    </div>
  )
}
