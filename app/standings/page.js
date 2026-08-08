"use client";

import { useState, useEffect } from "react";
import YearDropdown from "../../components/ui/YearDropdown";
import { isHarvard } from "../../lib/utils";
import { DEFAULT_ACADEMIC_YEAR } from "../../lib/constants";

export default function StandingsPage() {
  const [selectedYear, setSelectedYear] = useState(DEFAULT_ACADEMIC_YEAR);
  const [standingsData, setStandingsData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getCompetitions = () => {
    if (!standingsData || !standingsData.competitions) return [];

    const competitionOrder = ["Ivy League Championships", "NIRSA Region 1"];
    const competitions = [];

    for (const name of competitionOrder) {
      if (standingsData.competitions[name]) {
        competitions.push({
          name,
          teams: standingsData.competitions[name].teams,
        });
      }
    }

    // Add any other competitions not in the predefined order
    for (const name of Object.keys(standingsData.competitions)) {
      if (!competitionOrder.includes(name)) {
        competitions.push({
          name,
          teams: standingsData.competitions[name].teams,
        });
      }
    }

    return competitions;
  };

  const SkeletonRow = () => (
    <tr className="bg-white">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-4 w-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse mx-auto" /></td>
      <td className="px-4 py-5"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></td>
    </tr>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Team</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">W</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">L</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">T</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GF</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GA</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GD</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(4)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
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
                <SkeletonTable />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const competitions = getCompetitions();

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
        {competitions.length > 0 ? (
          <div className="space-y-12">
            {competitions.map((competition) => (
              <div key={competition.name}>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
                  {competition.name}
                </h3>
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
                        {competition.teams.map((team, index) => (
                          <tr
                            key={team.id}
                            className={`transition-all-smooth hover:bg-gray-50 ${
                              isHarvard(team.name)
                                ? "bg-[#A51C30]/5"
                                : "bg-white"
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
            ))}
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
