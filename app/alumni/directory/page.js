"use client";

import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import AlumniCard from "../../../components/ui/AlumniCard";
import PlayerProfileModal from "../../../components/ui/PlayerProfileModal";
import SearchBar from "../../../components/ui/SearchBar";
import FilterDropdowns from "../../../components/ui/FilterDropdowns";
import { supabase } from "../../../lib/supabase";
import { currentAcademicYearEnd } from "../../../lib/constants";

export default function AlumniDirectoryPage() {
  const [alumniData, setAlumniData] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    house: "",
    finalClub: "",
    graduationYear: "",
    concentration: "",
    currentJob: "",
    currentCompany: "",
    currentLocation: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique values for dynamic dropdowns from alumni data
  const dynamicOptions = useMemo(() => {
    const concentrations = new Set();
    const jobs = new Set();
    const companies = new Set();
    const locations = new Set();

    alumniData.forEach(({ profile }) => {
      if (profile?.concentration) concentrations.add(profile.concentration);
      if (profile?.current_job) jobs.add(profile.current_job);
      if (profile?.current_company) companies.add(profile.current_company);
      if (profile?.current_location) locations.add(profile.current_location);
    });

    return {
      concentrations: Array.from(concentrations).sort(),
      jobs: Array.from(jobs).sort(),
      companies: Array.from(companies).sort(),
      locations: Array.from(locations).sort(),
    };
  }, [alumniData]);

  useEffect(() => {
    async function fetchAlumniData() {
      try {
        setLoading(true);

        // Alumni are everyone whose graduation year has already passed, which is
        // the same rule deriveRole() applies. Rosters used to gate this list, so
        // an alum only appeared if their name was in a roster JSON; now a profile
        // is enough. A null graduation_year counts as alumni, matching
        // handle_new_user().
        const { data: alumniProfiles, error } = await supabase
          .from("profiles")
          .select("*")
          .not("full_name", "is", null)
          .or(
            `graduation_year.is.null,graduation_year.lt.${currentAcademicYearEnd()}`
          )
          .order("full_name");

        if (error) {
          console.error("Error fetching profiles:", error);
        }

        const alumniData = (alumniProfiles || []).map((profile) => ({
          name: profile.full_name,
          profile,
        }));

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

    // Apply search (name only)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      allAlumni = allAlumni.filter((alumni) =>
        alumni.name.toLowerCase().includes(searchTermLower)
      );
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

    if (filters.concentration) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.concentration === filters.concentration
      );
    }

    if (filters.currentJob) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.current_job === filters.currentJob
      );
    }

    if (filters.currentCompany) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.current_company === filters.currentCompany
      );
    }

    if (filters.currentLocation) {
      allAlumni = allAlumni.filter(
        (alumni) => alumni.profile?.current_location === filters.currentLocation
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

  const handleCardClick = (alumni) => {
    if (alumni.profile) {
      setSelectedAlumni(alumni.profile);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlumni(null);
  };

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-5">
        <div className="mb-4">
          <div className="flex gap-2 items-baseline">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-20 bg-gray-300 rounded animate-pulse" />
            <div className="h-3 w-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loading component
  const LoadingSkeleton = (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 w-80 bg-gray-300 rounded mx-auto mb-4" />
          <div className="h-6 w-64 bg-gray-200 rounded mx-auto mt-4 mb-6" />
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-full max-w-xl bg-gray-200 rounded-md" />
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="h-10 w-28 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );

  // Loading state (for data fetching after auth)
  if (loading) {
    return (
      <ProtectedRoute loadingComponent={LoadingSkeleton}>
        {LoadingSkeleton}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute loadingComponent={LoadingSkeleton}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Alumni Directory
            </h1>
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">
              Browse and connect with alumni.
            </p>
            <div className="flex flex-col items-center gap-6 mt-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search by name"
                className="w-full max-w-xl"
              />
              <FilterDropdowns
                filters={filters}
                onFilterChange={handleFilterChange}
                dynamicOptions={dynamicOptions}
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
                  onClick={() => handleCardClick(alumni)}
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

        <PlayerProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={selectedAlumni}
        />
      </div>
    </ProtectedRoute>
  );
}
