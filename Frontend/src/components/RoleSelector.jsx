import React from 'react';

const RoleSelector = ({ onRoleSelect }) => {
  return (
    <div>
      <h2>Select Your Role</h2>
      <div>
        <button onClick={() => onRoleSelect('student')}>
          Join as Student
        </button>
        <button onClick={() => onRoleSelect('teacher')}>
          Join as Teacher
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;