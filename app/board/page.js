"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import YearDropdown from "../../components/ui/YearDropdown";
import { formatBoardPositionTitle, getBoardPositionOrder } from "@/lib/utils";

export default function BoardPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [boardData, setBoardData] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

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

        // Query Supabase for board members
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select(
            "full_name, graduation_year, house, hometown, profile_image_url"
          )
          .in("full_name", names);

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        // Create an object of objects to store profile data
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Board</h1>
          <p className="mt-4 text-lg text-gray-600">
            Meet the ones who have guided the club throughout its history.
          </p>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              Loading board information...
            </div>
          </div>
        ) : boardData &&
          boardData.boardMembers &&
          boardData.boardMembers.length > 0 ? (
          <div className="space-y-12">
            {getBoardPositionOrder().map((position) => {
              const boardMembersByPosition = getBoardMembersByPosition();
              const members = boardMembersByPosition[position];

              if (!members || members.length === 0) return null;

              return (
                <div
                  key={position}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formatBoardPositionTitle(position, members)}
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-8">
                      {members.map((member, index) => {
                        const profile = profileData[member.name];
                        return (
                          <div
                            key={`${member.position}-${index}`}
                            className="flex flex-col sm:flex-row gap-6"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                <Image
                                  src={
                                    profile?.profile_image_url ||
                                    "/images/HarvardLogo.svg"
                                  }
                                  alt={member.name}
                                  width={128}
                                  height={128}
                                  className={`w-full h-full ${
                                    profile?.profile_image_url
                                      ? "object-cover"
                                      : "object-contain p-6"
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="space-y-3">
                                <div className="text-lg font-semibold text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {profile?.house && <div>{profile.house}</div>}
                                  {profile?.hometown && (
                                    <div>{profile.hometown}</div>
                                  )}
                                  {!profile && (
                                    <div className="text-gray-400 italic">
                                      Profile not found
                                    </div>
                                  )}
                                  {profile?.graduation_year && (
                                    <div>
                                      Class of {profile.graduation_year}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              No board information available for this year.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
