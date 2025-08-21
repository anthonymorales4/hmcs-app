"use client";

import ProfileSection from "./ProfileSection";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";

export default function PersonalInfoCard({ profile }) {
  if (!profile) return null;

  const { house, concentration, hometown, final_club } = profile;

  const personalInfoFields = [
    {
      label: "House",
      value: house,
      icon: <HomeIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Concentration",
      value: concentration,
      icon: <SchoolIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Hometown",
      value: hometown,
      icon: <LocationOnIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Final Club",
      value: final_club,
      icon: <GroupsIcon className="h-5 w-5 text-gray-400" />,
    },
  ];

  const fields = personalInfoFields.filter((field) => field.value);

  if (fields.length === 0) {
    return (
      <ProfileSection title="Personal Information">
        <p className="text-gray-500 italic">
          No personal information added yet.
        </p>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection title="Personal Information">
      <ul className="divide-y divide-gray-200">
        {fields.map((field, index) => (
          <li key={index} className={`${index === 0 ? "" : "pt-4"} pb-4`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">{field.icon}</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {field.label}
                </p>
                <p className="text-sm text-gray-500">{field.value}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}