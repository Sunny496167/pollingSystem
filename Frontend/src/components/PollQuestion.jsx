import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSubmitted } from '../store/pollSlice';
import socketService from '../services/socketService';

const PollQuestion = () => {
  const { question, options, isActive } = useSelector(state => state.poll);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasAnswered, setHasAnswered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isActive && !hasAnswered) {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, hasAnswered]);

  const handleTimeout = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      dispatch(setSubmitted());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer && !hasAnswered) {
      socketService.submitAnswer(selectedAnswer);
      setHasAnswered(true);
      dispatch(setSubmitted());
    }
  };

  const handleAnswerChange = (answer) => {
    if (!hasAnswered) {
      setSelectedAnswer(answer);
    }
  };

  if (!isActive) {
    return (
      <div>
        <h3>Waiting for poll question...</h3>
      </div>
    );
  }

  return (
    <div>
      <h3>{question}</h3>
      <div>Time remaining: {timeLeft} seconds</div>
      
      {!hasAnswered ? (
        <form onSubmit={handleSubmit}>
          {options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <div key={index}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={letter}
                    checked={selectedAnswer === letter}
                    onChange={() => handleAnswerChange(letter)}
                  />
                  {letter}. {option}
                </label>
              </div>
            );
          })}
          <button type="submit" disabled={!selectedAnswer}>
            Submit Answer
          </button>
        </form>
      ) : (
        <div>
          <p>Answer submitted! Waiting for results...</p>
          {selectedAnswer && (
            <p>Your answer: {selectedAnswer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PollQuestion;