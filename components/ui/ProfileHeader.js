"use client";

import RoleBadge from "./RoleBadge";

export default function ProfileHeader({ profile, isEditing, onEditClick }) {
  if (!profile) return null;

  const { full_name, graduation_year, role, position, board_position } =
    profile;

  const isBoard = board_position && board_position.trim() !== "";

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center gap-8">
        {/* Profile Information */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
                {full_name}
              </h1>

              {/* Class Year */}
              <h3 className="text-lg italic text-gray-700">
                Class of {graduation_year}
              </h3>

              {/* Position */}
              {position && (
                <p className="text-gray-600 font-medium">{position}</p>
              )}

              {/* Role Badges */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <RoleBadge role={role} />
                {isBoard &&
                  board_position.split(", ").map((boardPos, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                    >
                      {role === "alumni" ? `Ex-${boardPos}` : boardPos}
                    </span>
                  ))}
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex items-center">
              <button
                onClick={onEditClick}
                className={`mt-6 sm:mt-0 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditing
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-[#A51C30] hover:bg-[#8B1721] text-white"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
