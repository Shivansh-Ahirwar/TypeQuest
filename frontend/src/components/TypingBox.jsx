import { useRef } from 'react'
import useTyping from '../hooks/useTyping'
import '../styles/TypingBox.css'

export default function TypingBox({ text }) {
  const inputRef = useRef(null)
  const { typed, finished, seconds, stats, handleChange, reset } = useTyping(text)

  return (
    <div className="typing-box" onClick={() => inputRef.current?.focus()}>
      <div className="typing-stats">
        <span>Time: {seconds}s</span>
        <span>WPM: {stats.wpm}</span>
        <span>Accuracy: {stats.accuracy}%</span>
        <span>Errors: {stats.errors}</span>
      </div>

      <p className="typing-text">
        {text.split('').map((char, i) => {
          let cls = 'pending'
          if (i < typed.length) cls = typed[i] === char ? 'correct' : 'wrong'
          else if (i === typed.length) cls = 'current'
          return (
            <span key={i} className={cls}>
              {char}
            </span>
          )
        })}
      </p>

      <input
        ref={inputRef}
        className="typing-input"
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        disabled={finished}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {finished && (
        <div className="typing-done">
          <h3>Done!</h3>
          <p>
            {stats.wpm} WPM at {stats.accuracy}% accuracy
          </p>
        </div>
      )}

      <button className="typing-reset" onClick={reset}>
        Restart
      </button>
    </div>
  )
}
