import React, { useState, useEffect } from 'react';
import StudentNameInput from './StudentNameInput';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import socketService from '../services/socketService';

const StudentView = () => {
  const [studentName, setStudentName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if name exists in sessionStorage
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
    // Save name to sessionStorage (unique to tab, persistent on refresh)
    sessionStorage.setItem('studentName', name);
    setStudentName(name);
    connectAsStudent(name);
  };

  if (!studentName) {
    return <StudentNameInput onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div>
      <div>
        <h2>Student View</h2>
        <p>Welcome, {studentName}!</p>
        {isConnected && <p>Connected to server</p>}
      </div>
      
      <PollQuestion />
      <PollResults />
    </div>
  );
};

export default StudentView;