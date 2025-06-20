import React, { useEffect, useState } from 'react';
import CreatePollForm from './CreatePollForm';
import TeacherResults from './TeacherResults';
import socketService from '../services/socketService';

const TeacherView = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.joinAsTeacher();
    setIsConnected(true);
  }, []);

  return (
    <div>
      <div>
        <h2>Teacher View</h2>
        {isConnected && <p>Connected to server</p>}
      </div>
      
      <div>
        <CreatePollForm />
      </div>
      
      <hr />
      
      <div>
        <TeacherResults />
      </div>
    </div>
  );
};

export default TeacherView;