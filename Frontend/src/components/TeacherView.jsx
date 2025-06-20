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
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block mb-3 px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
            ✦ Intervue Poll
          </span>
          <h2 className="text-3xl font-bold text-gray-800">Teacher Panel</h2>
          {isConnected && (
            <p className="text-sm text-green-600 mt-1">✓ Connected to server</p>
          )}
        </div>

        {/* Create Poll Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Create a New Poll</h3>
          <CreatePollForm />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Results Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Live Results</h3>
          <TeacherResults />
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
