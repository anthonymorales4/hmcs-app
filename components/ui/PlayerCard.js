import Image from "next/image";
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

export default function PlayerCard({
  playerName,
  playerNumber,
  profileImageUrl,
  graduationYear,
  position,
}) {
  const nameParts = playerName.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];
  const PositionIcon = getPositionIcon(position);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all-smooth hover:scale-[1.02] group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`${playerName}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-110 ring-1 ring-inset ring-gray-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src="/images/HarvardLogo.svg"
              alt="Harvard Logo"
              width={80}
              height={80}
              className="opacity-50 group-hover:opacity-70 transition-opacity"
            />
          </div>
        )}
      </div>
      <div className="p-4 flex items-start justify-between">
        <div className="text-left">
          <div>
            <span className="text-sm text-gray-600 font-medium">{firstName} </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              {lastName}
            </span>
            {graduationYear && (
              <span className="text-sm text-gray-600 font-medium italic">
                {" "}&apos;{String(graduationYear).slice(-2)}
              </span>
            )}
          </div>
          {position && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
              <PositionIcon className="text-[#A51C30]" fontSize="small" />
              <span className="font-medium">{position}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[#A51C30] group-hover:text-[#8B1721] transition-colors">
            #{playerNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
