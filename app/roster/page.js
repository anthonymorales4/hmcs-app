"use client";

import { useState, useEffect } from "react";
import PlayerCard from "../../components/ui/PlayerCard";
import PlayerProfileModal from "../../components/ui/PlayerProfileModal";
import YearDropdown from "../../components/ui/YearDropdown";
import { supabase } from "../../lib/supabase";

export default function RosterPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [rosterData, setRosterData] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchRosterData() {
      try {
        setLoading(true);
        const response = await fetch(`/data/rosters/${selectedYear}.json`);
        const data = await response.json();
        setRosterData(data);

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) {
          console.error("Error fetching profiles:", error);
          setPlayerData(
            data.players.map((player, index) => ({
              name: player,
              number: index + 1,
              profileImageUrl: null,
              graduationYear: null,
              position: null,
              profile: null,
            }))
          );
        } else {
          const playerData = data.players.map((player, index) => {
            const profile = profiles.find((p) => p.full_name === player);
            return {
              name: player,
              number: index + 1,
              profileImageUrl: profile?.profile_image_url || null,
              graduationYear: profile?.graduation_year || null,
              position: profile?.position || null,
              profile: profile || null,
            };
          });
          setPlayerData(playerData);
        }
      } catch (error) {
        console.error("Error fetching roster data:", error);
        setPlayerData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRosterData();
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleCardClick = (player) => {
    if (player.profile) {
      setSelectedPlayer(player.profile);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 animate-pulse">
            {/* Header skeleton */}
            <div className="h-12 bg-gray-300 rounded-lg w-48 mb-4"></div>
            {/* Subheader skeleton */}
            <div className="h-6 bg-gray-200 rounded w-96 mt-4"></div>
            {/* Divider skeleton */}
            <div className="h-1 bg-gray-300 rounded my-6 w-32"></div>
            {/* Year dropdown skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
          {/* Player cards skeleton grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="h-48 bg-gray-200"></div>
                {/* Content skeleton */}
                <div className="p-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-8"></div>
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
            Roster
          </h1>
          <p className="mt-4 text-xl text-gray-600 leading-relaxed">
            Meet current and past players of the club.
          </p>
          <div className="gradient-divider my-6 w-32"></div>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        {rosterData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {playerData.map((player, index) => (
              <PlayerCard
                key={index}
                playerName={player.name}
                playerNumber={player.number}
                profileImageUrl={player.profileImageUrl}
                graduationYear={player.graduationYear}
                position={player.position}
                onClick={() => handleCardClick(player)}
              />
            ))}
          </div>
        )}
        {!rosterData && !loading && (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <p className="text-xl text-gray-600 font-medium">
                No roster data available for {selectedYear}.
              </p>
            </div>
          </div>
        )}
      </div>

      <PlayerProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        profile={selectedPlayer}
      />
    </div>
  );
}
