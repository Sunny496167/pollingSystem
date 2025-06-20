import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSubmitted } from '../store/pollSlice';
import socketService from '../services/socketService';

const PollQuestion = () => {
  const { question, options, isActive } = useSelector((state) => state.poll);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasAnswered, setHasAnswered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isActive && !hasAnswered) {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <span className="inline-block mb-6 px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
          ✦ Intervue Poll
        </span>
        <div className="mb-6">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-800">
          Wait for the teacher to ask questions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">Question 1</h4>
          <div className="flex items-center text-sm text-red-600 font-medium">
            ⏱ <span className="ml-1">{String(timeLeft).padStart(2, '0')}s</span>
          </div>
        </div>

        {/* Question Box */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-700 text-white px-4 py-2 text-sm font-semibold">
            {question}
          </div>
          <form onSubmit={handleSubmit} className="bg-white p-4 space-y-4">
            {options.map((opt, idx) => {
              const number = idx + 1;
              const isSelected = selectedAnswer === String(number);
              return (
                <label
                  key={idx}
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-gray-100'
                  }`}
                >
                  <div
                    className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold mr-3 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'
                    }`}
                  >
                    {number}
                  </div>
                  <input
                    type="radio"
                    name="answer"
                    value={number}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(String(number))}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-800">{opt}</span>
                </label>
              );
            })}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={!selectedAnswer}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-8 rounded-full disabled:opacity-50 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PollQuestion;
