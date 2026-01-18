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
      <div className="p-4 h-18 flex items-center justify-between">
        <div className="text-left">
          <div>
            <span className="text-sm text-gray-600 font-medium">{firstName} </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              {lastName}
            </span>
          </div>
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
