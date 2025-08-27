import Image from "next/image";

export default function PlayerCard({
  playerName,
  playerNumber,
  profileImageUrl,
}) {
  const nameParts = playerName.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`${playerName}`}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image
              src="/HarvardLogo.svg"
              alt="Harvard Logo"
              width={80}
              height={80}
            />
          </div>
        )}
      </div>

      <div className="p-3 h-16 flex items-center justify-between">
        <div className="text-left">
          <div>
            <span className="text-sm text-gray-700">{firstName} </span>
            <span className="text-lg font-bold text-gray-900 uppercase">
              {lastName}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[#A51C30]">
            #{playerNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
