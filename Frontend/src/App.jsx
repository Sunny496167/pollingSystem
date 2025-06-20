import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import RoleSelector from './components/RoleSelector';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import socketService from './services/socketService';

function App() {
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    // Connect socket service with Redux store
    socketService.connect(store);

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole('');
    // Clear student name from sessionStorage if going back
    if (selectedRole === 'student') {
      sessionStorage.removeItem('studentName');
    }
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header>
          {selectedRole && (
            <button onClick={handleBackToRoleSelection}>
              Back to Role Selection
            </button>
          )}
        </header>
        
        <main>
          {!selectedRole && (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          )}
          
          {selectedRole === 'student' && (
            <StudentView />
          )}
          
          {selectedRole === 'teacher' && (
            <TeacherView />
          )}
        </main>
      </div>
    </Provider>
  );
}

export default App;