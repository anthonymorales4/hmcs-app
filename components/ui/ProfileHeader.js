"use client";

import RoleBadge from "./RoleBadge";
import ProfileImageUpload from "./ProfileImageUpload";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const getPositionIcon = (position) => {
  const positionLower = position?.toLowerCase() || "";

  if (positionLower.includes("goalkeeper") || positionLower.includes("goalie") || positionLower.includes("gk")) {
    return SportsHandballIcon;
  }
  if (positionLower.includes("defender") || positionLower.includes("defense") || positionLower.includes("back")) {
    return ShieldIcon;
  }
  if (positionLower.includes("midfielder") || positionLower.includes("midfield") || positionLower.includes("mid")) {
    return AutoFixHighIcon;
  }
  if (positionLower.includes("forward") || positionLower.includes("striker") || positionLower.includes("attacker")) {
    return RocketLaunchIcon;
  }

  return SportsSoccerIcon;
};

export default function ProfileHeader({
  profile,
  isEditing,
  onEditClick,
  onImageUpdate,
}) {
  if (!profile) return null;

  const { full_name, graduation_year, role, position, board_position } =
    profile;

  const isBoard = board_position && board_position.trim() !== "";
  const PositionIcon = getPositionIcon(position);

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <ProfileImageUpload
          profile={profile}
          isEditing={isEditing}
          onImageUpdate={onImageUpdate}
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {full_name}
                {graduation_year && (
                  <span className="font-normal italic text-xl text-gray-500 ml-2">
                    '{String(graduation_year).slice(-2)}
                  </span>
                )}
              </h1>
              {position && (
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <PositionIcon className="text-[#A51C30]" fontSize="small" />
                  <span>{position}</span>
                </div>
              )}
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
            {!isEditing && (
              <div className="flex items-center">
                <button
                  onClick={onEditClick}
                  className="mt-6 sm:mt-0 px-6 py-2 rounded-md text-sm font-medium transition-colors bg-[#A51C30] hover:bg-[#8B1721] text-white"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
