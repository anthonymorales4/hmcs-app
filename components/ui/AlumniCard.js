import { useState } from "react";
import Image from "next/image";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import AlumniProfileModal from "./AlumniProfileModal";

export default function AlumniCard({ name, profile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nameParts = name.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  const profileImageUrl = profile?.profile_image_url;
  const currentJob = profile?.current_job;
  const currentCompany = profile?.current_company;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all-smooth hover:scale-[1.02] group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`${name}`}
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
      <div className="p-5">
        <div className="mb-4">
          <div className="text-left">
            <span className="text-sm text-gray-600 font-medium">
              {firstName}{" "}
            </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              {lastName}
            </span>
          </div>
        </div>
        {(currentJob || currentCompany) && (
          <div className="space-y-3 text-sm text-gray-700">
            {currentJob && (
              <div className="flex items-center gap-3 group/item">
                <WorkIcon className="text-[#A51C30]" fontSize="small" />
                <span className="font-medium">{currentJob}</span>
              </div>
            )}
            {currentCompany && (
              <div className="flex items-center gap-3 group/item">
                <BusinessIcon className="text-[#A51C30]" fontSize="small" />
                <span className="font-medium">{currentCompany}</span>
              </div>
            )}
            <div className="flex items-center gap-3 group/item">
              <SchoolIcon className="text-[#A51C30]" fontSize="small" />
              <span className="font-medium">
                Class of {profile.graduation_year}
              </span>
            </div>
          </div>
        )}
      </div>
      {profile && (
        <>
          <div className="px-5 pb-4 flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#A51C30] text-sm font-semibold hover:text-[#8a1828] transition-colors flex items-center gap-1"
            >
              View Profile <span>›</span>
            </button>
          </div>
          <AlumniProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            alumni={{ name, profile }}
          />
        </>
      )}
    </div>
  );
}
