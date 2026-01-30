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
  const { profile: authProfile } = useAuth();

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

  // Skeleton loading state
  const LoadingSkeleton = (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ProfileHeader Skeleton */}
        <div className="rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  {/* Name */}
                  <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
                  {/* Position */}
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  {/* Badges */}
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
                {/* Edit button */}
                <div className="h-10 w-16 bg-gray-200 rounded-md animate-pulse mt-6 sm:mt-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ProfileCompletionBar Skeleton */}
        <div className="mt-6 bg-white shadow rounded-lg p-6 mb-6 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded mt-2 sm:mt-0" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </div>

        {/* AboutMeCard Skeleton */}
        <div className="mt-6 bg-white border border-gray-200 shadow-lg rounded-xl animate-pulse">
          <div className="px-6 py-5 border-b-2 border-b-gray-100 bg-gray-50">
            <div className="h-7 w-28 bg-gray-200 rounded" />
          </div>
          <div className="px-8 pt-6 pb-8 space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>

        {/* PersonalInfoCard & ContactInfoCard Skeleton (2-column grid) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 shadow-lg rounded-xl animate-pulse">
              <div className="px-6 py-5 border-b-2 border-b-gray-100 bg-gray-50">
                <div className="h-7 w-44 bg-gray-200 rounded" />
              </div>
              <div className="px-8 pt-6 pb-8">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0" />
                      <div className="ml-3 space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CareerInfoCard Skeleton */}
        <div className="mt-6 bg-white border border-gray-200 shadow-lg rounded-xl animate-pulse">
          <div className="px-6 py-5 border-b-2 border-b-gray-100 bg-gray-50">
            <div className="h-7 w-44 bg-gray-200 rounded" />
          </div>
          <div className="px-8 pt-6 pb-8">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0" />
                  <div className="ml-3 space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute loadingComponent={LoadingSkeleton}>
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
