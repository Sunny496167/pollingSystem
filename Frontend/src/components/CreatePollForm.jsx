import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

const CreatePollForm = () => {
  const { isActive } = useSelector((state) => state.poll);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOptions, setCorrectOptions] = useState([false, false]);
  const [timer, setTimer] = useState(60);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
      setCorrectOptions([...correctOptions, false]);
    }
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const updateCorrect = (index, value) => {
    const updated = [...correctOptions];
    updated[index] = value;
    setCorrectOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) return alert('Please enter a question');

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) return alert('At least 2 options required');

    socketService.createPoll({
      question: question.trim(),
      options: validOptions.map((text, i) => ({
        text,
        isCorrect: correctOptions[i] || false,
      })),
      duration: timer
    });

    setQuestion('');
    setOptions(['', '']);
    setCorrectOptions([false, false]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-4">
        <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
          ✦ Intervue Poll
        </span>
      </div>

      <h2 className="text-2xl font-medium text-gray-800 mb-1">
        Let’s <strong className="font-bold">Get Started</strong>
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        You’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>

      {isActive && (
        <div className="mb-4 text-red-600 text-sm">
          A poll is currently active. Please wait for it to finish before creating a new one.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Enter your question</label>
            <select
              className="border border-gray-300 text-sm rounded px-2 py-1"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              {[30, 60, 90, 120].map((t) => (
                <option key={t} value={t}>{t} seconds</option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            maxLength={100}
            placeholder="Type your question here"
            className="w-full border rounded p-3 text-sm text-gray-700 resize-none bg-gray-100"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isActive}
          />
          <p className="text-right text-xs text-gray-400">{question.length}/100</p>
        </div>

        {/* Options List */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-600 font-medium">Edit Options</label>
            <label className="text-sm text-gray-600 font-medium">Is it Correct?</label>
          </div>

          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{i + 1}</span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 bg-gray-100 border rounded p-2 text-sm"
                  placeholder={`Option ${i + 1}`}
                  disabled={isActive}
                />
              </div>

              <div className="flex gap-2">
                <label className="flex items-center text-sm gap-1">
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    checked={correctOptions[i] === true}
                    onChange={() => updateCorrect(i, true)}
                  />
                  Yes
                </label>
                <label className="flex items-center text-sm gap-1">
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    checked={correctOptions[i] === false}
                    onChange={() => updateCorrect(i, false)}
                  />
                  No
                </label>
              </div>
            </div>
          ))}

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-indigo-600 hover:underline mt-2"
              disabled={isActive}
            >
              + Add More option
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="border-t pt-4 text-right">
          <button
            type="submit"
            className="bg-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-indigo-600 disabled:opacity-50"
            disabled={isActive}
          >
            Ask Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePollForm;
