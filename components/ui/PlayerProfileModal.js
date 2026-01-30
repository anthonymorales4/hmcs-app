"use client";

import { useEffect } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import RoleBadge from "./RoleBadge";
import { formatInstagramUrl } from "@/lib/utils";

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

export default function PlayerProfileModal({ isOpen, onClose, profile }) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !profile) return null;

  const {
    full_name,
    graduation_year,
    role,
    position,
    board_position,
    bio,
    house,
    concentration,
    hometown,
    final_club,
    email,
    phone_number,
    linkedin_url,
    instagram_url,
    current_job,
    current_company,
    current_location,
    profile_image_url,
  } = profile;

  const isBoard = board_position && board_position.trim() !== "";
  const PositionIcon = getPositionIcon(position);
  const isAlumni = role === "alumni";

  // Personal info fields
  const personalInfoFields = [
    { label: "House", value: house, icon: <HomeIcon className="h-5 w-5 text-gray-400" /> },
    { label: "Concentration", value: concentration, icon: <SchoolIcon className="h-5 w-5 text-gray-400" /> },
    { label: "Hometown", value: hometown, icon: <LocationOnIcon className="h-5 w-5 text-gray-400" /> },
    { label: "Final Club", value: final_club, icon: <GroupsIcon className="h-5 w-5 text-gray-400" /> },
  ].filter((field) => field.value);

  // Contact info fields
  const contactInfoFields = [
    { label: "Email", value: email, icon: <EmailIcon className="h-5 w-5 text-gray-400" />, link: email ? `mailto:${email}` : null },
    { label: "Phone", value: phone_number, icon: <PhoneIcon className="h-5 w-5 text-gray-400" />, link: phone_number ? `tel:${phone_number}` : null },
    { label: "LinkedIn", value: linkedin_url ? full_name : null, icon: <LinkedInIcon className="h-5 w-5 text-gray-400" />, link: linkedin_url },
    { label: "Instagram", value: instagram_url ? formatInstagramUrl(instagram_url) : null, icon: <InstagramIcon className="h-5 w-5 text-gray-400" />, link: instagram_url },
  ].filter((field) => field.value);

  // Career info fields (only for alumni)
  const careerInfoFields = isAlumni
    ? [
        { label: "Job", value: current_job, icon: <WorkIcon className="h-5 w-5 text-gray-400" /> },
        { label: "Company", value: current_company, icon: <BusinessIcon className="h-5 w-5 text-gray-400" /> },
        { label: "Location", value: current_location, icon: <LocationOnIcon className="h-5 w-5 text-gray-400" /> },
      ].filter((field) => field.value)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors group cursor-pointer"
        >
          <CloseIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>

        {/* Header section */}
        <div className="bg-white rounded-t-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-4 ring-gray-100">
              {profile_image_url ? (
                <Image
                  src={profile_image_url}
                  alt={full_name}
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image
                    src="/images/HarvardLogo.svg"
                    alt="Harvard Logo"
                    width={48}
                    height={48}
                    className="opacity-50"
                  />
                </div>
              )}
            </div>

            {/* Name and badges */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {full_name}
                {graduation_year && (
                  <span className="font-normal italic text-lg sm:text-xl text-gray-500 ml-2">
                    '{String(graduation_year).slice(-2)}
                  </span>
                )}
              </h2>
              {position && (
                <div className="flex items-center gap-2 text-gray-600 font-medium mt-2 justify-center sm:justify-start">
                  <PositionIcon className="text-[#A51C30]" fontSize="small" />
                  <span>{position}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {role && <RoleBadge role={role} />}
                {isBoard &&
                  board_position.split(", ").map((boardPos, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                    >
                      {boardPos}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* About Me */}
          {bio && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-900">About Me</h3>
              </div>
              <div className="px-6 py-5">
                <div className="prose prose-sm max-w-none">
                  {bio.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-2 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Two column grid for Personal and Contact info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            {personalInfoFields.length > 0 && (
              <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="px-6 py-5">
                  <ul className="divide-y divide-gray-200">
                    {personalInfoFields.map((field, index) => (
                      <li key={index} className={`${index === 0 ? "" : "pt-4"} pb-4`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">{field.icon}</div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{field.label}</p>
                            <p className="text-sm text-gray-500">{field.value}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {contactInfoFields.length > 0 && (
              <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="px-6 py-5">
                  <ul className="divide-y divide-gray-200">
                    {contactInfoFields.map((field, index) => (
                      <li key={index} className={`${index === 0 ? "" : "pt-4"} pb-4`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">{field.icon}</div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{field.label}</p>
                            {field.link ? (
                              <a
                                href={field.link}
                                target={field.label === "Email" || field.label === "Phone" ? "_self" : "_blank"}
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
                </div>
              </div>
            )}
          </div>

          {/* Career Information (only for alumni) */}
          {isAlumni && careerInfoFields.length > 0 && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-900">Career Information</h3>
              </div>
              <div className="px-6 py-5">
                <ul className="divide-y divide-gray-200">
                  {careerInfoFields.map((field, index) => (
                    <li key={index} className={`${index === 0 ? "" : "pt-4"} pb-4`}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">{field.icon}</div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{field.label}</p>
                          <p className="text-sm text-gray-500">{field.value}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
