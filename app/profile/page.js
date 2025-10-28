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
import ProfileEditForm from "../../components/ui/ProfileEditForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { profile: authProfile, loading } = useAuth();

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
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">
            Loading profile information...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onEditClick={handleToggleEdit}
            onImageUpdate={handleImageUpdate}
          />
          {profile && (
            <div className="mt-6">
              <ProfileCompletionBar profile={profile} />
            </div>
          )}
          {isEditing ? (
            <div className="mt-6">
              <ProfileEditForm
                profile={profile}
                onCancel={handleToggleEdit}
                onUpdate={handleProfileUpdate}
              />
            </div>
          ) : (
            profile && (
              <>
                <div className="mt-6">
                  <AboutMeCard profile={profile} />
                </div>
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PersonalInfoCard profile={profile} />
                  <ContactInfoCard profile={profile} />
                </div>
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
