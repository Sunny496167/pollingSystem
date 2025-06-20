import React, { useState } from 'react';

const RoleSelector = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-4">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full">
            ✦ Intervue Poll
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">
          Welcome to the <strong className="font-bold">Live Polling System</strong>
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            onClick={() => handleSelect('student')}
            className={`cursor-pointer border rounded-lg p-4 text-left hover:border-indigo-500 shadow-sm transition-all duration-200 ${
              selectedRole === 'student' ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:shadow'
            }`}
          >
            <h3 className="font-semibold text-gray-800">I’m a Student</h3>
            <p className="text-sm text-gray-500 mt-1">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          <div
            onClick={() => handleSelect('teacher')}
            className={`cursor-pointer border rounded-lg p-4 hover:border-indigo-500 text-left shadow-sm transition-all duration-200 ${
              selectedRole === 'teacher' ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:shadow'
            }`}
          >
            <h3 className="font-semibold text-gray-800">I’m a Teacher</h3>
            <p className="text-sm text-gray-500 mt-1">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
