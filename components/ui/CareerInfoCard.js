"use client";

import ProfileSection from "./ProfileSection";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function CareerInfoCard({ profile }) {
  if (!profile || profile.role !== "alumni") return null;

  const { current_job, current_location, current_company } = profile;

  const hasCareerInfo = current_job || current_company || current_location;

  if (!hasCareerInfo) {
    return (
      <ProfileSection title="Career Information">
        <p className="text-gray-500 italic">No career information added yet.</p>
      </ProfileSection>
    );
  }

  const careerInfoFields = [
    {
      label: "Current Job",
      value: current_job,
      icon: <WorkIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Company",
      value: current_company,
      icon: <BusinessIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      label: "Current Location",
      value: current_location,
      icon: <LocationOnIcon className="h-5 w-5 text-gray-400" />,
    },
  ];

  const fields = careerInfoFields.filter((field) => field.value);

  return (
    <ProfileSection title="Career Information">
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
