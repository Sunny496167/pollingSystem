import React, { useState } from 'react';

const StudentNameInput = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        {/* Label */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
            ✦ Intervue Poll
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-medium text-gray-800 mb-1">
          Let’s <strong className="font-bold">Get Started</strong>
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          If you're a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Bajaj"
              required
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameInput;
