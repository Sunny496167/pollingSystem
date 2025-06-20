import React, { useState, useEffect } from 'react';
import StudentNameInput from './StudentNameInput';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import socketService from '../services/socketService';

const StudentView = () => {
  const [studentName, setStudentName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem('studentName');
    if (savedName) {
      setStudentName(savedName);
      connectAsStudent(savedName);
    }
  }, []);

  const connectAsStudent = (name) => {
    socketService.joinAsStudent(name);
    setIsConnected(true);
  };

  const handleNameSubmit = (name) => {
    sessionStorage.setItem('studentName', name);
    setStudentName(name);
    connectAsStudent(name);
  };

  if (!studentName) {
    return <StudentNameInput onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block mb-3 px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
            ✦ Intervue Poll
          </span>
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {studentName}!</h2>
          {isConnected && (
            <p className="text-sm text-green-600 mt-1">✓ Connected to server</p>
          )}
        </div>

        {/* Poll Question Component */}
        <PollQuestion />

        {/* Poll Results Component */}
        <PollResults />
      </div>
    </div>
  );
};

export default StudentView;
