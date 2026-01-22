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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        {loading ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                Loading board information...
              </div>
            </div>
          </div>
        ) : boardData &&
          boardData.boardMembers &&
          boardData.boardMembers.length > 0 ? (
          <div className="space-y-8">
            {getBoardPositionOrder().map((position) => {
              const boardMembersByPosition = getBoardMembersByPosition();
              const members = boardMembersByPosition[position];

              if (!members || members.length === 0) return null;

              return (
                <div
                  key={position}
                  className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all-smooth"
                >
                  <div className="px-8 py-5 border-b-2 border-b-gray-100 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {formatBoardPositionTitle(position, members)}
                    </h2>
                  </div>
                  <div className="p-8">
                    <div className="grid gap-8">
                      {members.map((member, index) => {
                        const profile = profileData[member.name];
                        return (
                          <div
                            key={`${member.position}-${index}`}
                            className="flex flex-col sm:flex-row gap-6 group"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-36 h-36 rounded-full overflow-hidden transition-all-smooth">
                                <Image
                                  src={
                                    profile?.profile_image_url ||
                                    "/images/HarvardLogo.svg"
                                  }
                                  alt={member.name}
                                  width={144}
                                  height={144}
                                  className={`w-full h-full ${
                                    profile?.profile_image_url
                                      ? "object-cover"
                                      : "object-contain p-6 opacity-50"
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="space-y-3">
                                <div className="text-xl font-bold text-gray-900 tracking-tight">
                                  {member.name}
                                </div>
                                <div className="text-base text-gray-600 font-medium space-y-2">
                                  {profile?.graduation_year && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#A51C30]">•</span>
                                      Class of {profile.graduation_year}
                                    </div>
                                  )}
                                  {profile?.house && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#A51C30]">•</span>
                                      {profile.house}
                                    </div>
                                  )}
                                  {profile?.hometown && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#A51C30]">•</span>
                                      {profile.hometown}
                                    </div>
                                  )}
                                  {!profile && (
                                    <div className="text-gray-400 italic">
                                      Profile not found
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
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                No board information available for this year.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
