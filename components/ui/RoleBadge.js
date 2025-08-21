"use client";

export default function RoleBadge({ role }) {
  const badgeColors = {
    current_player: {
      bg: "bg-green-100",
      text: "text-green-800",
    },
    alumni: {
      bg: "bg-blue-100",
      text: "text-blue-800",
    },
  };

  const { bg, text } = badgeColors[role];

  const displayText = role === "current_player" ? "Player" : "Alumni";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
    >
      {displayText}
    </span>
  );
}
