"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";
import { ACADEMIC_YEAR_OPTIONS } from "../../lib/constants";

export default function SchedulePage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const getAllGames = () => {
    if (!scheduleData) return [];

    let allGames = [];

    if (scheduleData.seasons.nirsa) {
      allGames = [
        ...allGames,
        ...scheduleData.seasons.nirsa.games.map((game) => ({
          ...game,
          competition: "nirsa",
          teamName: scheduleData.seasons.nirsa.teamName,
        })),
      ];
    }

    if (scheduleData.seasons.ivies) {
      allGames = [
        ...allGames,
        ...scheduleData.seasons.ivies.games.map((game) => ({
          ...game,
          competition: "ivies",
          teamName: scheduleData.seasons.ivies.teamName,
        })),
      ];
    }

    // Sort by date descending (most recent first)
    return allGames.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const getCompetitionBanner = (competition) => {
    switch (competition) {
      case "nirsa":
        return "NIRSA Region 1";
      case "ivies":
        return "Ivy League Championships";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule</h1>
          <p className="mt-4 text-lg text-gray-600">
            View upcoming games and match schedules.
          </p>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading schedule...</div>
          </div>
        ) : scheduleData && getAllGames().length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {getAllGames().map((game) => (
                <div
                  key={`${game.competition}-${game.id}`}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {game.teamName}{" "}
                        {isHarvardHome(game, game.teamName) ? "vs." : "@"}{" "}
                        {getOpponent(game, game.teamName)}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          game.competition === "nirsa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {getCompetitionBanner(game.competition)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {formatDate(game.date)} / {formatTime(game.time)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {getHarvardScore(game, game.teamName)} -{" "}
                        {getOpponentScore(game, game.teamName)}
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getResultColor(
                        game.result
                      )}`}
                    >
                      {getResultLetter(game.result)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : scheduleData === null ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              {selectedYear === "2020-2021"
                ? "No games were played during the 2020-2021 season due to COVID-19."
                : "No schedule data available for this year."}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              No games scheduled for this year.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
