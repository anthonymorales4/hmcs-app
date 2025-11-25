import Image from "next/image";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";

export default function AlumniCard({ name, profile }) {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  const profileImageUrl = profile?.profile_image_url;
  const currentJob = profile?.current_job;
  const currentCompany = profile?.current_company;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`${name}`}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image
              src="/images/HarvardLogo.svg"
              alt="Harvard Logo"
              width={80}
              height={80}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="text-left">
            <span className="text-sm text-gray-700">{firstName} </span>
            <span className="text-lg font-bold text-gray-900 uppercase">
              {lastName}
            </span>
          </div>
        </div>
        {(currentJob || currentCompany) && (
          <div className="space-y-2 text-sm text-gray-600">
            {currentJob && (
              <div className="flex items-center gap-2">
                <WorkIcon className="text-[#A51C30]" fontSize="small" />
                <span>{currentJob}</span>
              </div>
            )}
            {currentCompany && (
              <div className="flex items-center gap-2">
                <BusinessIcon className="text-[#A51C30]" fontSize="small" />
                <span>{currentCompany}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <SchoolIcon className="text-[#A51C30]" fontSize="small" />
              <span>Class of {profile.graduation_year}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
