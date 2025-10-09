"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";

export default function StandingsPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [standingsData, setStandingsData] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState("nirsa");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStandingsData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    // Auto-select first available competition when data loads
    if (standingsData && standingsData.competitions) {
      const availableCompetitions = Object.keys(standingsData.competitions);
      if (availableCompetitions.length > 0) {
        setSelectedCompetition(availableCompetitions.includes("nirsa") ? "nirsa" : availableCompetitions[0]);
      }
    }
  }, [standingsData]);

  const loadStandingsData = async (year) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/standings/${year}.json`);
      if (response.ok) {
        const data = await response.json();
        setStandingsData(data);
      } else {
        setStandingsData(null);
      }
    } catch (error) {
      console.error("Error loading standings data:", error);
      setStandingsData(null);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableCompetitions = () => {
    if (!standingsData || !standingsData.competitions) return [];
    return Object.keys(standingsData.competitions);
  };

  const getCurrentStandings = () => {
    if (!standingsData || !standingsData.competitions || !standingsData.competitions[selectedCompetition]) {
      return [];
    }
    return standingsData.competitions[selectedCompetition].teams || [];
  };

  const getCompetitionName = (competition) => {
    switch (competition) {
      case "nirsa": return "NIRSA Region 1";
      case "ivies": return "Ivy League Championships";
      default: return competition.toUpperCase();
    }
  };

  const isHarvardTeam = (teamName) => {
    return teamName.toLowerCase().includes("harvard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Standings</h1>
          <p className="mt-4 text-lg text-gray-600">
            Current league standings and team performance.
          </p>
          <YearDropdown
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading standings...</div>
          </div>
        ) : standingsData && Object.keys(standingsData.competitions).length > 0 ? (
          <div className="space-y-6">
            {/* Competition Selector */}
            {getAvailableCompetitions().length > 1 && (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-sm p-1 flex">
                  {getAvailableCompetitions().map((competition) => (
                    <button
                      key={competition}
                      onClick={() => setSelectedCompetition(competition)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedCompetition === competition
                          ? "bg-[#A51C30] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {getCompetitionName(competition)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {getCompetitionName(selectedCompetition)}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        T
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GF
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GA
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GD
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentStandings().map((team, index) => (
                      <tr
                        key={team.id}
                        className={`${
                          isHarvardTeam(team.name)
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">
                              {index + 1}.
                            </div>
                            <div className={`text-sm ${
                                isHarvardTeam(team.name)
                                  ? "font-bold text-[#A51C30]"
                                  : "font-medium text-gray-900"
                            }`}>
                              {team.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.wins}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.losses}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.ties}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.goalsFor}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.goalsAgainst}
                        </td>
                        <td className={`px-3 py-4 whitespace-nowrap text-center text-sm font-medium ${
                            team.goalDifference > 0
                              ? "text-green-600"
                              : team.goalDifference < 0
                              ? "text-red-600"
                              : "text-gray-900"
                        }`}>
                          {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : standingsData === null ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              {selectedYear === "2020-2021"
                ? "No standings available for the 2020-2021 season due to COVID-19."
                : "No standings data available for this year."}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">No standings data available for this year.</div>
          </div>
        )}
      </div>
    </div>
  );
}