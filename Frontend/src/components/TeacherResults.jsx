import React from 'react';
import { useSelector } from 'react-redux';

const TeacherResults = () => {
  const { question, options, results, isActive } = useSelector(state => state.poll);

  if (!isActive || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No active poll</p>
      </div>
    );
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">Question 1</h4>
          <div className="flex items-center text-sm text-red-600 font-medium">
            ⏱ <span className="ml-1">00:15</span>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-700 text-white px-4 py-2 text-sm font-semibold">
            {question}
          </div>

          {/* Results */}
          <div className="bg-white p-4 space-y-4">
            {options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const count = results[letter] || 0;
              const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

              return (
                <div key={idx} className="relative rounded-md border border-gray-200 bg-gray-100 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-indigo-500 transition-all" style={{ width: `${percent}%` }}></div>
                  <div className="relative z-10 flex items-center px-4 py-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold mr-3">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-white">{opt}</span>
                    <span className="ml-auto text-sm font-semibold text-white">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-base font-medium text-gray-800">
            Wait for the teacher to ask a new question..
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherResults;
