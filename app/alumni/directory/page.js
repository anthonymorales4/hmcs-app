"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import AlumniCard from "../../../components/ui/AlumniCard";
import SearchBar from "../../../components/ui/SearchBar";
import FilterDropdowns from "../../../components/ui/FilterDropdowns";
import { supabase } from "../../../lib/supabase";
import { ACADEMIC_YEAR_OPTIONS } from "../../../lib/constants";

export default function AlumniDirectoryPage() {
  const [alumniData, setAlumniData] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    house: "",
    finalClub: "",
    graduationYear: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumniData() {
      try {
        setLoading(true);

        // A set is a built-in object that allows storing unique values of any type
        const alumniNames = new Set();

        async function fetchRosterForAcademicYear(academicYear, alumniNames) {
          try {
            const response = await fetch(`/data/rosters/${academicYear}.json`);
            if (response.ok) {
              const data = await response.json();
              data.players.forEach((playerName) => alumniNames.add(playerName));
            }
          } catch (error) {
            console.error(`Error fetching ${academicYear} roster:`, error);
          }
        }

        // Array containing 7 promises (one for each academic year)
        const rosterPromises = ACADEMIC_YEAR_OPTIONS.map((academicYear) =>
          fetchRosterForAcademicYear(academicYear, alumniNames)
        );

        // Process all 7 promises in parallel
        await Promise.all(rosterPromises);

        // Get profile data from Supabase
        const { data: alumniProfiles, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "alumni");

        if (error) {
          console.error("Error fetching profiles:", error);
        }

        // Combine roster names with profile data
        const alumniData = Array.from(alumniNames).map((name) => {
          const profile =
            alumniProfiles?.find((p) => p.full_name === name) || null;
          return {
            name,
            profile,
          };
        });

        setAlumniData(alumniData);
        setFilteredAlumni(alumniData);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlumniData();
  }, []);

  useEffect(() => {
    let allAlumni = [...alumniData];

    // Apply search
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      allAlumni = allAlumni.filter((alumni) => {
        const profile = alumni.profile;
        return (
          alumni.name.toLowerCase().includes(searchTermLower) ||
          profile?.concentration?.toLowerCase().includes(searchTermLower) ||
          profile?.hometown?.toLowerCase().includes(searchTermLower) ||
          profile?.current_job?.toLowerCase().includes(searchTermLower) ||
          profile?.current_location?.toLowerCase().includes(searchTermLower) ||
          profile?.current_company?.toLowerCase().includes(searchTermLower)
        );
      });
    }

    // Apply filters
    if (filters.house) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.house === filters.house
      );
    }

    if (filters.finalClub) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.final_club === filters.finalClub
      );
    }

    if (filters.graduationYear) {
      allAlumni = allAlumni.filter(
        (alumni) =>
          alumni.profile?.graduation_year === parseInt(filters.graduationYear)
      );
    }

    setFilteredAlumni(allAlumni);
  }, [searchTerm, filters, alumniData]);

  // Event handlers
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">
            Loading alumni information...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Alumni Directory
            </h1>
            <p className="mt-4 mb-4 text-lg text-gray-600">
              Browse and connect with alumni.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-8">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              <FilterDropdowns
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumni, index) => (
                <AlumniCard
                  key={`${alumni.name}-${index}`}
                  name={alumni.name}
                  profile={alumni.profile}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No alumni found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
