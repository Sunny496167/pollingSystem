import React from 'react';
import { useSelector } from 'react-redux';

const PollResults = () => {
  const { question, options, results, hasSubmitted } = useSelector(state => state.poll);

  if (!hasSubmitted || !question) return null;

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Results for: <span className="text-indigo-600">{question}</span>
      </h3>

      <div className="space-y-4">
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          const count = results[letter] || 0;
          const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

          return (
            <div key={index}>
              <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
                <span>{letter}. {option}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <strong>Total votes:</strong> {totalVotes}
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm italic">
        Wait for the teacher to ask a new question..
      </p>
    </div>
  );
};

export default PollResults;
