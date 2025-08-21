"use client";

import ProfileSection from "./ProfileSection";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function ContactInfoCard({ profile }) {
  if (!profile) return null;

  const { email, phone_number, linkedin_url, instagram_url } = profile;

  const contactInfoFields = [
    {
      label: "Email",
      value: email,
      icon: <EmailIcon className="h-5 w-5 text-gray-400" />,
      link: email ? `mailto:${email}` : null,
    },
    {
      label: "Phone",
      value: phone_number,
      icon: <PhoneIcon className="h-5 w-5 text-gray-400" />,
      link: phone_number ? `tel:${phone_number}` : null,
    },
    {
      label: "LinkedIn",
      value: linkedin_url ? "View Profile" : null,
      icon: <LinkedInIcon className="h-5 w-5 text-gray-400" />,
      link: linkedin_url,
    },
    {
      label: "Instagram",
      value: instagram_url ? "View Profile" : null,
      icon: <InstagramIcon className="h-5 w-5 text-gray-400" />,
      link: instagram_url,
    },
  ];

  const fields = contactInfoFields.filter((field) => field.value);

  if (fields.length === 0) {
    return (
      <ProfileSection title="Contact Information">
        <p className="text-gray-500 italic">
          No contact information added yet.
        </p>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection title="Contact Information">
      <ul className="divide-y divide-gray-200">
        {fields.map((field, index) => (
          <li key={index} className={`${index === 0 ? "" : "pt-4"} pb-4`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">{field.icon}</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {field.label}
                </p>
                {field.link ? (
                  <a
                    href={field.link}
                    target={
                      field.label === "Email" || field.label === "Phone"
                        ? "_self"
                        : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="text-sm text-[#A51C30] hover:text-[#8B1721] hover:underline transition-colors"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">{field.value}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}