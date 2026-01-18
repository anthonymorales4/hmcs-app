"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Standings</h1>
          <p className="mt-4 text-xl text-gray-600 leading-relaxed">
            Current league standings and team performance.
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
              <div className="text-xl text-gray-600 font-medium">Loading standings...</div>
            </div>
          </div>
        ) : standingsData &&
          Object.keys(standingsData.competitions).length > 0 ? (
          <div className="space-y-8">
            {getCompetitions().length > 1 && (
              <div className="flex justify-center">
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-2 flex gap-2">
                  {getCompetitions().map((competition) => (
                    <button
                      key={competition}
                      onClick={() => setSelectedCompetition(competition)}
                      className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all-smooth ${
                        selectedCompetition === competition
                          ? "bg-[#A51C30] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {competition}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        T
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        GF
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        GA
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        GD
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTeams().map((team, index) => (
                      <tr
                        key={team.id}
                        className={`transition-all-smooth hover:bg-[#A51C30]/5 cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-bold text-[#A51C30] mr-3 min-w-[1.5rem]">
                              {index + 1}.
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {team.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                          {team.wins}
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                          {team.losses}
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                          {team.ties}
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                          {team.goalsFor}
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                          {team.goalsAgainst}
                        </td>
                        <td className={`px-4 py-5 whitespace-nowrap text-center text-sm font-bold ${
                          team.goalDifference > 0
                            ? "text-green-600"
                            : team.goalDifference < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}>
                          {team.goalDifference > 0
                            ? `+${team.goalDifference}`
                            : team.goalDifference}
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-center text-sm font-bold text-[#A51C30]">
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
          <div className="text-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-md mx-auto">
              <div className="text-xl text-gray-600 font-medium">
                No standings data available for this year.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
