import { useState, useCallback } from "react";
import { fetchParableQuizQuestions, type ParableQuestion } from './api';

interface QuestionResult {
  question: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
}

export default function TriviaGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<ParableQuestion[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartGame = useCallback(async () => {
    setGameStarted(true);
    const questions = await fetchParableQuizQuestions(10);

    setQuestions(questions);
  }, []);

  const handleAnswerClick = useCallback(
    (answer: string) => {
      if (isAnswered) return;

      setSelectedAnswer(answer);
      setIsAnswered(true);

      const isCorrect = answer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      setResults((prevResults) => [
        ...prevResults,
        {
          question: currentQuestion.question,
          correct: isCorrect,
          selectedAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ]);

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
        } else {
          setShowResults(true);
        }
      }, 1000);
    },
    [currentQuestion, currentQuestionIndex, isAnswered]
  );

  const getButtonClass = (answer: string) => {
    let base = "answer-btn";
    if (isAnswered) {
      if (answer === currentQuestion.correctAnswer) {
        base += " correct";
      } else if (answer === selectedAnswer) {
        base += " wrong";
      } else {
        base += " disabled";
      }
    }
    return base;
  };

  const handleRestart = useCallback(() => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setResults([]);
    setShowResults(false);
  }, []);

  // Intro screen
  if (!gameStarted) {
    return (
      <div className="game-container">
        <div className="card">
          <h1 className="title">Parables Quiz</h1>
          <p className="subtitle">Do You Know Your Parables?</p>
          <button className="start-btn" onClick={handleStartGame}>
            Start Game
          </button>
          <p className="hint">Press START to begin</p>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="game-container">
        <div className="card">
          <h1 className="title">Game Over!</h1>
          <p className="score-text">
            You scored {score} out of {questions.length}!
          </p>

          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className={`result-item ${result.correct ? "correct" : "wrong"}`}>
                <p className="result-question">
                  {index + 1}. {result.question}
                </p>
                <p>
                  Your Answer:{" "}
                  <span className={result.correct ? "correct-text" : "wrong-text"}>
                    {result.selectedAnswer}
                  </span>
                </p>
                {!result.correct && (
                  <p>
                    Correct Answer: <span className="correct-text">{result.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <button className="restart-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Loading screen
  if (questions.length === 0) {
    return (
      <div className="game-container">
        <div className="card">
          <h1 className="title">Loading Questions...</h1>
          <p className="loading-text">Please wait while we fetch the questions.</p>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="game-container">
      <div className="card">
        <div className="header">
          <h1 className="title">Parables Quiz</h1>
          <div className="score-box">Score: {score}</div>
        </div>

        <div className="question-section">
          <p className="question-progress">
            Question {currentQuestionIndex + 1} / {questions.length}
          </p>
          <p className="question-text">{currentQuestion?.question}</p>
        </div>

        <div className="answers-grid">
          {currentQuestion?.options.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={isAnswered}
              className={getButtonClass(answer)}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
