"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import YearDropdown from "../../components/ui/YearDropdown";
import PlayerProfileModal from "../../components/ui/PlayerProfileModal";
import { formatBoardPositionTitle, getBoardPositionOrder } from "@/lib/utils";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function BoardPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [boardData, setBoardData] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadBoardData(year) {
      setLoading(true);
      try {
        const response = await fetch(`/data/board/${year}.json`);
        if (response.ok) {
          const data = await response.json();
          setBoardData(data);

          if (data.boardMembers) {
            await loadProfileData(data.boardMembers);
          }
        } else {
          setBoardData(null);
          setProfileData({});
        }
      } catch (error) {
        console.error("Error loading board data:", error);
        setBoardData(null);
        setProfileData({});
      } finally {
        setLoading(false);
      }
    }

    async function loadProfileData(boardMembers) {
      try {
        const names = boardMembers.map((member) => member.name);

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .in("full_name", names);

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        const profileData = {};
        profiles?.forEach((profile) => {
          profileData[profile.full_name] = profile;
        });

        setProfileData(profileData);
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    }

    loadBoardData(selectedYear);
  }, [selectedYear]);

  const getBoardMembersByPosition = () => {
    if (!boardData || !boardData.boardMembers) return {};

    const membersByPosition = {};
    boardData.boardMembers.forEach((member) => {
      const position = member.position;
      if (!membersByPosition[position]) {
        membersByPosition[position] = [];
      }
      membersByPosition[position].push(member);
    });

    return membersByPosition;
  };

  const handleCardClick = (member) => {
    const profile = profileData[member.name];
    if (profile) {
      // Add board_position to the profile for display in the modal
      setSelectedMember({ ...profile, board_position: member.position });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-5">
        <div className="mb-4">
          <div className="flex gap-2 items-end">
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <div className="h-12 w-40 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="h-6 w-[28rem] bg-gray-200 rounded animate-pulse mt-4" />
            <div className="h-1 w-32 bg-gray-200 rounded my-6 animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse mt-4" />
          </div>
          <div className="space-y-12">
            {[1, 2, 3, 4].map((section) => (
              <div key={section}>
                <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(section === 3 ? 2 : 1)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Board
          </h1>
          <p className="mt-4 text-xl text-gray-600 leading-relaxed">
            Meet the ones who have guided the club throughout its history.
          </p>
          <div className="gradient-divider my-6 w-32"></div>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        {boardData &&
          boardData.boardMembers &&
          boardData.boardMembers.length > 0 ? (
          <div className="space-y-12">
            {getBoardPositionOrder().map((position) => {
              const boardMembersByPosition = getBoardMembersByPosition();
              const members = boardMembersByPosition[position];

              if (!members || members.length === 0) return null;

              const nameParts = (name) => {
                const parts = name.trim().split(" ");
                return {
                  firstName: parts.slice(0, -1).join(" "),
                  lastName: parts[parts.length - 1],
                };
              };

              return (
                <div key={position}>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
                    {formatBoardPositionTitle(position, members)}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((member, index) => {
                      const profile = profileData[member.name];
                      const { firstName, lastName } = nameParts(member.name);

                      return (
                        <div
                          key={`${member.position}-${index}`}
                          className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all-smooth hover:scale-[1.02] group cursor-pointer"
                          onClick={() => handleCardClick(member)}
                        >
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            {profile?.profile_image_url ? (
                              <Image
                                src={profile.profile_image_url}
                                alt={member.name}
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
                                {profile?.graduation_year && (
                                  <span className="text-sm text-gray-600 font-medium italic">
                                    {" "}&apos;{String(profile.graduation_year).slice(-2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {(profile?.concentration || profile?.house || profile?.hometown) && (
                              <div className="space-y-3 text-sm text-gray-700">
                                {profile?.concentration && (
                                  <div className="flex items-center gap-3">
                                    <SchoolIcon className="text-[#A51C30]" fontSize="small" />
                                    <span className="font-medium">{profile.concentration}</span>
                                  </div>
                                )}
                                {profile?.house && (
                                  <div className="flex items-center gap-3">
                                    <HomeIcon className="text-[#A51C30]" fontSize="small" />
                                    <span className="font-medium">{profile.house}</span>
                                  </div>
                                )}
                                {profile?.hometown && (
                                  <div className="flex items-center gap-3">
                                    <LocationOnIcon className="text-[#A51C30]" fontSize="small" />
                                    <span className="font-medium">{profile.hometown}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                No board information available for this year.
              </div>
            </div>
          </div>
        )}
      </div>

      <PlayerProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        profile={selectedMember}
      />
    </div>
  );
}
