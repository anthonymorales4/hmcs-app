"use client";

import { useProfileCompletion } from "../../hooks/useProfileCompletion";

export default function ProfileCompletionBar({ profile }) {
  const { percentage, tip, color } = useProfileCompletion(profile);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-900">
          Profile Completion
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {percentage}% Complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        <span className="font-medium">Tip:</span> {tip}
      </p>
    </div>
  );
}