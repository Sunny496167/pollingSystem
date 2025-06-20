import React from 'react';
import { useSelector } from 'react-redux';

const PollResults = () => {
  const { question, options, results, hasSubmitted } = useSelector(state => state.poll);

  if (!hasSubmitted || !question) {
    return null;
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div>
      <h3>Results for: {question}</h3>
      {options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const count = results[letter] || 0;
        const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
        
        return (
          <div key={index}>
            <div>
              <strong>{letter}. {option}</strong>
            </div>
            <div>
              Votes: {count} ({percentage}%)
            </div>
            <div>
              <div 
                style={{
                  width: '200px',
                  height: '20px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50'
                  }}
                />
              </div>
            </div>
            <br />
          </div>
        );
      })}
      <div>
        <strong>Total votes: {totalVotes}</strong>
      </div>
    </div>
  );
};

export default PollResults;