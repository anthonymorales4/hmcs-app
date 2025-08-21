"use client";

import ProfileSection from "./ProfileSection";

export default function AboutMeCard({ profile }) {
  if (!profile) return null;

  const { bio } = profile;

  return (
    <ProfileSection title="About Me">
      {bio ? (
        <div className="prose prose-sm max-w-none">
          {bio.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-2 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No bio added yet.</p>
      )}
    </ProfileSection>
  );
}