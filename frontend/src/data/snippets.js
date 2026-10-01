const snippets = [
  'The quick brown fox jumps over the lazy dog.',
  'Practice makes progress, so keep typing every single day.',
  'A journey of a thousand miles begins with a single step.',
  'Good typists keep their eyes on the screen and their fingers on the home row.',
  'Speed comes from accuracy, so slow down and get every letter right.',
  'Small daily habits build big skills over time.',
  'Typing without looking at the keyboard is called touch typing.',
  'Every expert was once a beginner who refused to give up.',
]

export function getRandomSnippet(exclude) {
  const options = snippets.filter((s) => s !== exclude)
  return options[Math.floor(Math.random() * options.length)]
}

export default snippets
