"use client";

import { useState, useEffect } from "react";
import PlayerCard from "../../components/ui/PlayerCard";
import YearDropdown from "../../components/ui/YearDropdown";
import { supabase } from "../../lib/supabase";

export default function RosterPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [rosterData, setRosterData] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRosterData() {
      try {
        setLoading(true);
        const response = await fetch(`/data/rosters/${selectedYear}.json`);
        const data = await response.json();
        setRosterData(data);

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("full_name, profile_image_url");

        if (error) {
          console.error("Error fetching profiles:", error);
          setPlayerData(
            data.players.map((player, index) => ({
              name: player,
              number: index + 1,
              profileImageUrl: null,
            }))
          );
        } else {
          const playerData = data.players.map((player, index) => {
            const profile = profiles.find((p) => p.full_name === player);
            return {
              name: player,
              number: index + 1,
              profileImageUrl: profile?.profile_image_url || null,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
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
    </div>
  );
}
