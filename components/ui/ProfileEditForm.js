"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ProfileSection from "./ProfileSection";
import {
  HOUSE_OPTIONS,
  FINAL_CLUB_OPTIONS,
  POSITION_OPTIONS,
  BOARD_POSITION_OPTIONS,
} from "../../lib/constants";
import {
  formatPhoneNumber,
  validateInstagramUrl,
  validateLinkedInUrl,
  validatePhoneNumber,
} from "@/lib/utils";
// Personal Info icons
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BadgeIcon from "@mui/icons-material/Badge";
// Contact Info icons
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
// Career Info icons
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";

function FormDropdown({ label, name, value, options, onChange, placeholder, icon }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  const displayValue = value || placeholder || `Select ${label.toLowerCase()}`;
  const hasValue = Boolean(value);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      <div
        className="relative inline-flex items-center w-full"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          type="button"
          className={`flex items-center justify-between w-full gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all-smooth cursor-pointer shadow-sm ${
            hasValue ? "text-gray-900" : "text-gray-500"
          }`}
        >
          <span>{displayValue}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 pt-2 z-50">
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 animate-slide-up max-h-64 overflow-y-auto">
              {options.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`block w-full text-left px-5 py-3 text-sm font-medium whitespace-nowrap transition-all-smooth cursor-pointer ${
                    option === value
                      ? "bg-gray-100 text-black"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileEditForm({ profile, onCancel, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    graduation_year: "",
    position: "",
    hometown: "",
    concentration: "",
    house: "",
    final_club: "",
    current_job: "",
    current_company: "",
    current_location: "",
    board_position: "",
    bio: "",
    linkedin_url: "",
    instagram_url: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        graduation_year: profile.graduation_year || "",
        position: profile.position || "",
        hometown: profile.hometown || "",
        concentration: profile.concentration || "",
        house: profile.house || "",
        final_club: profile.final_club || "",
        current_job: profile.current_job || "",
        current_company: profile.current_company || "",
        current_location: profile.current_location || "",
        board_position: profile.board_position || "",
        bio: profile.bio || "",
        linkedin_url: profile.linkedin_url || "",
        instagram_url: profile.instagram_url || "",
      });
    }
  }, [profile]);

  function validateField(name, value) {
    const errors = { ...validationErrors };

    switch (name) {
      case "phone_number":
        if (!validatePhoneNumber(value)) {
          errors.phone_number = "Please enter a valid 10-digit phone number";
        } else {
          delete errors.phone_number;
        }
        break;

      case "linkedin_url":
        if (!validateLinkedInUrl(value)) {
          errors.linkedin_url = "Please enter a valid LinkedIn profile URL";
        } else {
          delete errors.linkedin_url;
        }
        break;

      case "instagram_url":
        if (!validateInstagramUrl(value)) {
          errors.instagram_url = "Please enter a valid Instagram profile URL";
        } else {
          delete errors.instagram_url;
        }
        break;
    }

    setValidationErrors(errors);
  }

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "phone_number") {
      value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBlur(event) {
    const name = event.target.name;
    const value = event.target.value;
    validateField(name, value);
  }

  async function handleSubmit(event) {
    event.preventDefault(); // Stop the page from reloading
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Object.keys() returns an array of an object's own property names (keys)
    if (Object.keys(validationErrors).length > 0) {
      setError(
        "Please make sure all fields are formatted properly before submitting"
      );
      setIsLoading(false);
      return;
    }

    try {
      const savedData = {
        ...formData,
        graduation_year: formData.graduation_year
          ? parseInt(formData.graduation_year)
          : null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(savedData)
        .eq("id", profile.id);

      if (error) throw error;

      setSuccess(true);
      setValidationErrors({});

      if (onUpdate) {
        onUpdate({
          ...profile,
          ...savedData,
        });
      }

      // Exit edit mode after 1.5 seconds
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-6">
        <ProfileSection title="About Me">
          <div>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </ProfileSection>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSection title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="House"
              name="house"
              value={formData.house}
              options={HOUSE_OPTIONS}
              onChange={handleChange}
              placeholder="Select a house"
              icon={<HomeIcon fontSize="small" />}
            />
            <div>
              <label
                htmlFor="concentration"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <span className="text-gray-400"><SchoolIcon fontSize="small" /></span>
                Concentration
              </label>
              <input
                type="text"
                name="concentration"
                id="concentration"
                value={formData.concentration}
                onChange={handleChange}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                placeholder="e.g., Economics"
              />
            </div>
            <div>
              <label
                htmlFor="hometown"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <span className="text-gray-400"><LocationOnIcon fontSize="small" /></span>
                Hometown
              </label>
              <input
                type="text"
                name="hometown"
                id="hometown"
                value={formData.hometown}
                onChange={handleChange}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                placeholder="e.g., Chicago, IL"
              />
            </div>
            <FormDropdown
              label="Final Club"
              name="final_club"
              value={formData.final_club}
              options={FINAL_CLUB_OPTIONS}
              onChange={handleChange}
              placeholder="Select a final club"
              icon={<GroupsIcon fontSize="small" />}
            />
            <FormDropdown
              label="Position"
              name="position"
              value={formData.position}
              options={POSITION_OPTIONS}
              onChange={handleChange}
              placeholder="Select a position"
              icon={<SportsSoccerIcon fontSize="small" />}
            />
            <FormDropdown
              label="Board Position"
              name="board_position"
              value={formData.board_position}
              options={BOARD_POSITION_OPTIONS}
              onChange={handleChange}
              placeholder="Select a board position"
              icon={<BadgeIcon fontSize="small" />}
            />
          </div>
        </ProfileSection>
        <ProfileSection title="Contact Information">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phone_number"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <span className="text-gray-400"><PhoneIcon fontSize="small" /></span>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                placeholder="e.g., (617) 555-0123"
              />
              {validationErrors.phone_number && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.phone_number}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="linkedin_url"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <span className="text-gray-400"><LinkedInIcon fontSize="small" /></span>
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin_url"
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                onBlur={handleBlur}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                placeholder="https://www.linkedin.com/in/yourname"
              />
              {validationErrors.linkedin_url && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.linkedin_url}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="instagram_url"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <span className="text-gray-400"><InstagramIcon fontSize="small" /></span>
                Instagram
              </label>
              <input
                type="url"
                name="instagram_url"
                id="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                onBlur={handleBlur}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                placeholder="https://www.instagram.com/yourname"
              />
              {validationErrors.instagram_url && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.instagram_url}
                </p>
              )}
            </div>
          </div>
        </ProfileSection>
      </div>
      {profile.role === "alumni" && (
        <div className="mt-6">
          <ProfileSection title="Career Information">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="current_job"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                >
                  <span className="text-gray-400"><WorkIcon fontSize="small" /></span>
                  Current Job
                </label>
                <input
                  type="text"
                  name="current_job"
                  id="current_job"
                  value={formData.current_job}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                  placeholder="e.g., Investment Banking"
                />
              </div>
              <div>
                <label
                  htmlFor="current_company"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                >
                  <span className="text-gray-400"><BusinessIcon fontSize="small" /></span>
                  Current Company
                </label>
                <input
                  type="text"
                  name="current_company"
                  id="current_company"
                  value={formData.current_company}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                  placeholder="e.g., Goldman Sachs"
                />
              </div>
              <div>
                <label
                  htmlFor="current_location"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
                >
                  <span className="text-gray-400"><LocationOnIcon fontSize="small" /></span>
                  Current Location
                </label>
                <input
                  type="text"
                  name="current_location"
                  id="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-900 focus:outline-none"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </ProfileSection>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#8B1721] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
