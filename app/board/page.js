"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import YearDropdown from "../../components/ui/YearDropdown";

export default function BoardPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [boardData, setBoardData] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBoardData(selectedYear);
  }, [selectedYear]);

  const loadBoardData = async (year) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/board/${year}.json`);
      if (response.ok) {
        const data = await response.json();
        setBoardData(data);

        // Load profile data from Supabase for each board member
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
  };

  const loadProfileData = async (boardMembers) => {
    try {
      const names = boardMembers.map((member) => member.name);

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

      // Create a lookup object
      const profileLookup = {};
      profiles?.forEach((profile) => {
        profileLookup[profile.full_name] = profile;
      });

      setProfileData(profileLookup);
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const groupBoardMembers = () => {
    if (!boardData || !boardData.boardMembers) return {};

    const grouped = {};
    boardData.boardMembers.forEach((member) => {
      const position = member.position;
      if (!grouped[position]) {
        grouped[position] = [];
      }
      grouped[position].push(member);
    });

    return grouped;
  };

  const getPositionOrder = () => {
    return ["President", "Captain", "Treasurer", "Social Chair"];
  };

  const formatPositionTitle = (position, members) => {
    if (position === "Captain" && members.length > 1) {
      return "Captains";
    }
    return position;
  };

  const formatPositionWithNames = (position, members) => {
    const positionTitle = formatPositionTitle(position, members);
    if (members.length === 1) {
      return `${positionTitle}: ${members[0].name}`;
    } else if (members.length > 1) {
      const names = members.map((m) => m.name).join(" & ");
      return `${positionTitle}: ${names}`;
    }
    return positionTitle;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedYear} BOARD
          </h1>
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
            {getPositionOrder().map((position) => {
              const grouped = groupBoardMembers();
              const members = grouped[position];

              if (!members || members.length === 0) return null;

              return (
                <div
                  key={position}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                      {formatPositionWithNames(position, members)}
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
                            {/* Image */}
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                                <Image
                                  src={
                                    profile?.profile_image_url ||
                                    "/HarvardLogo.svg"
                                  }
                                  alt={member.name}
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                              <div className="space-y-3">
                                <div className="text-lg font-semibold text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {profile?.graduation_year && (
                                    <div>
                                      Class of {profile.graduation_year}
                                    </div>
                                  )}
                                  {profile?.house && <div>{profile.house}</div>}
                                  {profile?.hometown && (
                                    <div>{profile.hometown}</div>
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
        ) : boardData === null ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              {selectedYear === "2020-2021"
                ? "No board information available for the 2020-2021 season due to COVID-19."
                : "No board information available for this year."}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              No board members listed for this year.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
