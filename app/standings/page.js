"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";
import { isHarvard } from "@/lib/utils";

export default function StandingsPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [standingsData, setStandingsData] = useState(null);
  const [selectedCompetition, setSelectedCompetition] =
    useState("NIRSA Region 1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStandingsData(year) {
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
    }

    loadStandingsData(selectedYear);
  }, [selectedYear]);

  function getCompetitions() {
    if (!standingsData || !standingsData.competitions) return [];
    return Object.keys(standingsData.competitions);
  }

  const getTeams = () => {
    if (!standingsData || !standingsData.competitions) return [];
    return standingsData.competitions[selectedCompetition].teams;
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
        ) : standingsData &&
          Object.keys(standingsData.competitions).length > 0 ? (
          <div className="space-y-6">
            {getCompetitions().length > 1 && (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-sm p-1 flex">
                  {getCompetitions().map((competition) => (
                    <button
                      key={competition}
                      onClick={() => setSelectedCompetition(competition)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedCompetition === competition
                          ? "bg-[#A51C30] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {competition}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    {getTeams().map((team, index) => (
                      <tr
                        key={team.id}
                        className="bg-gray-50 hover:bg-gray-100"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">
                              {index + 1}.
                            </div>
                            <div className="text-sm font-medium">
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
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {team.goalDifference > 0
                            ? `+${team.goalDifference}`
                            : team.goalDifference}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">
              No standings data available for this year.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
