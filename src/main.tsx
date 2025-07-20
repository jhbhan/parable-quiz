import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ParablesQuiz from './ParablesQuiz'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParablesQuiz />
  </StrictMode>,
)
