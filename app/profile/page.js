"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProfileHeader from "../../components/ui/ProfileHeader";
import ProfileCompletionBar from "../../components/ui/ProfileCompletionBar";
import AboutMeCard from "../../components/ui/AboutMeCard";
import PersonalInfoCard from "../../components/ui/PersonalInfoCard";
import ContactInfoCard from "../../components/ui/ContactInfoCard";
import CareerInfoCard from "../../components/ui/CareerInfoCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, profile: authProfile, loading } = useAuth();

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
    }
  }, [authProfile]);

  function handleToggleEdit() {
    setIsEditing(!isEditing);
  }

  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
    setIsEditing(false);
  }

  function handleImageUpdate(updatedProfile) {
    setProfile(updatedProfile);
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30]"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onEditClick={handleToggleEdit}
            onProfileUpdate={handleImageUpdate}
          />

          {/* Profile Completion Bar */}
          {profile && (
            <div className="mt-6">
              <ProfileCompletionBar profile={profile} />
            </div>
          )}

          {/* Profile Content */}
          {isEditing ? (
            <div className="mt-6">
              {/* TODO: ProfileEditForm component will go here */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Edit Profile
                </h3>
                <p className="text-gray-500">
                  ProfileEditForm component coming soon...
                </p>
                <button
                  onClick={handleToggleEdit}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm 
          font-medium transition-colors"
                >
                  Cancel for now
                </button>
              </div>
            </div>
          ) : (
            profile && (
              <>
                {/* About Me Section - Full Width */}
                <div className="mt-6">
                  <AboutMeCard profile={profile} />
                </div>

                {/* Two Column Layout - Personal Info & Contact Info */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PersonalInfoCard profile={profile} />
                  <ContactInfoCard profile={profile} />
                </div>

                {/* Career Information - Full Width (Alumni Only) */}
                {profile.role === "alumni" && (
                  <div className="mt-6">
                    <CareerInfoCard profile={profile} />
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
