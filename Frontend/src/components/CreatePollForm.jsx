import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

const CreatePollForm = () => {
  const { isActive } = useSelector(state => state.poll);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    const pollData = {
      question: question.trim(),
      options: validOptions.map(opt => opt.trim())
    };

    socketService.createPoll(pollData);
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div>
      <h3>Create New Poll</h3>
      
      {isActive && (
        <div>
          <p><strong>A poll is currently active. Please wait for it to finish before creating a new one.</strong></p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            disabled={isActive}
            required
          />
        </div>

        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                disabled={isActive}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={isActive}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              disabled={isActive}
            >
              Add Option
            </button>
          )}
        </div>

        <button type="submit" disabled={isActive}>
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePollForm;