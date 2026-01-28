"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";

export default function SchedulePage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScheduleData(selectedYear);
  }, [selectedYear]);

  const loadScheduleData = async (year) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/schedule/${year}.json`);
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data);
      } else {
        setScheduleData(null);
      }
    } catch (error) {
      console.error("Error loading schedule data:", error);
      setScheduleData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return `${month} ${day}${suffix}`;
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatTime = (timeString) => {
    if (timeString === "TBD") return "TBD";
    const [time, period] = timeString.split(" ");
    const [hour, minute] = time.split(":");
    const formattedHour = parseInt(hour, 10);
    const formattedTime =
      minute === "00"
        ? `${formattedHour}${period}`
        : `${formattedHour}:${minute}${period}`;
    return formattedTime;
  };

  const isHarvardHome = (game, teamName) => {
    return (
      game.homeTeam.toLowerCase().includes("harvard") ||
      game.homeTeam
        .toLowerCase()
        .includes(teamName?.toLowerCase().split(" ")[0] || "harvard")
    );
  };

  const getOpponent = (game, teamName) => {
    const harvardName = teamName || "Harvard";
    return isHarvardHome(game, harvardName) ? game.awayTeam : game.homeTeam;
  };

  const getHarvardScore = (game, teamName) => {
    const isHome = isHarvardHome(game, teamName);
    return isHome ? game.score.home : game.score.away;
  };

  const getOpponentScore = (game, teamName) => {
    const isHome = isHarvardHome(game, teamName);
    return isHome ? game.score.away : game.score.home;
  };

  const getGamesByCompetition = () => {
    if (!scheduleData) return [];

    const competitions = [];

    // Ivy League Championships first
    if (scheduleData.seasons.ivies && scheduleData.seasons.ivies.games.length > 0) {
      const games = scheduleData.seasons.ivies.games
        .map((game) => ({
          ...game,
          teamName: scheduleData.seasons.ivies.teamName,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      competitions.push({
        name: "Ivy League Championships",
        games,
      });
    }

    // NIRSA Region 1 second
    if (scheduleData.seasons.nirsa && scheduleData.seasons.nirsa.games.length > 0) {
      const games = scheduleData.seasons.nirsa.games
        .map((game) => ({
          ...game,
          teamName: scheduleData.seasons.nirsa.teamName,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      competitions.push({
        name: "NIRSA Region 1",
        games,
      });
    }

    return competitions;
  };

  const getResultColor = (result) => {
    switch (result) {
      case "WIN":
        return "bg-green-500";
      case "LOSS":
        return "bg-red-500";
      case "TIE":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getResultLetter = (result) => {
    switch (result) {
      case "WIN":
        return "W";
      case "LOSS":
        return "L";
      case "TIE":
        return "T";
      default:
        return "-";
    }
  };

  const SkeletonRow = () => (
    <div className="p-6 flex items-center justify-between">
      <div className="flex-1">
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="mt-2 flex gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <div className="h-12 w-56 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mt-4" />
            <div className="h-1 w-32 bg-gray-200 rounded my-6 animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-12">
            {[1, 2].map((section) => (
              <div key={section}>
                <div className="h-8 w-56 bg-gray-300 rounded animate-pulse mb-6" />
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {[...Array(4)].map((_, index) => (
                      <SkeletonRow key={index} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const competitions = getGamesByCompetition();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Schedule</h1>
          <p className="mt-4 text-xl text-gray-600 leading-relaxed">
            View upcoming games and match schedules.
          </p>
          <div className="gradient-divider my-6 w-32"></div>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        {competitions.length > 0 ? (
          <div className="space-y-12">
            {competitions.map((competition) => (
              <div key={competition.name}>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
                  {competition.name}
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {competition.games.map((game) => (
                      <div
                        key={game.id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all-smooth"
                      >
                        <div className="flex-1">
                          <div className="text-lg font-bold text-gray-900">
                            {game.teamName}{" "}
                            <span className="text-[#A51C30] mx-1">
                              {isHarvardHome(game, game.teamName) ? "vs." : "@"}
                            </span>{" "}
                            {getOpponent(game, game.teamName)}
                          </div>
                          <div className="mt-2 text-sm font-medium text-gray-600">
                            {formatDate(game.date)} • {formatTime(game.time)}
                          </div>
                        </div>
                        <div className="text-right text-2xl font-bold italic">
                          <span className="text-gray-900">
                            {getHarvardScore(game, game.teamName)} - {getOpponentScore(game, game.teamName)}
                          </span>
                          <span className={`ml-3 ${
                            game.result === "WIN"
                              ? "text-green-600"
                              : game.result === "LOSS"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}>
                            {getResultLetter(game.result)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : scheduleData === null ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                {selectedYear === "2020-2021"
                  ? "No games were played during the 2020-2021 season due to COVID-19."
                  : "No schedule data available for this year."}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                No games scheduled for this year.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
