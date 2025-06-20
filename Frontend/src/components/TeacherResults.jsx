import React from 'react';
import { useSelector } from 'react-redux';

const TeacherResults = () => {
  const { question, options, results, isActive } = useSelector(state => state.poll);

  if (!isActive || !question) {
    return (
      <div>
        <h3>Live Results</h3>
        <p>No active poll</p>
      </div>
    );
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div>
      <h3>Live Results</h3>
      <h4>{question}</h4>
      
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
                  width: '300px',
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: '#2196F3',
                    transition: 'width 0.3s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
            <br />
          </div>
        );
      })}
      
      <div>
        <strong>Total votes: {totalVotes}</strong>
      </div>
      
      {totalVotes > 0 && (
        <div>
          <small>Results update in real-time</small>
        </div>
      )}
    </div>
  );
};

export default TeacherResults;