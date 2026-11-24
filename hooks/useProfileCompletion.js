"use client";

import { useMemo } from "react";
import { REQUIRED_FIELDS, PROFILE_COMPLETION } from "../lib/constants";
import { deriveRole } from "../lib/utils";

export function useProfileCompletion(profile) {
  const { percentage, tip, color } = useMemo(() => {
    if (!profile) {
      return null;
    }

    // Determine required fields based on role
    const requiredFields = [
      ...REQUIRED_FIELDS.COMMON,
      ...(deriveRole(profile.graduation_year) === "alumni"
        ? REQUIRED_FIELDS.ALUMNI_ADDITIONAL
        : []),
    ];

    // Calculate completed fields
    const completedFields = requiredFields.filter((field) => {
      const value = profile[field];
      return value !== null && value !== undefined && value !== "";
    });

    const percentage = Math.round(
      (completedFields.length / requiredFields.length) * 100
    );

    // Get helpful tip for next step
    const tip = getTip(profile, requiredFields);

    // Get color based on percentage
    const color = getColor(percentage);

    return { percentage, tip, color };
  }, [profile]);

  return { percentage, tip, color };
}

function getTip(profile, requiredFields) {
  // Check for missing fields in priority order
  const missingFields = requiredFields.filter((field) => {
    const value = profile[field];
    return value === null || value === undefined || value === "";
  });

  if (missingFields.length === 0) {
    return "🎉 Your profile is complete! Great job!";
  }

  // Priority order for tips
  const tipPriority = [
    { field: "profile_image_url", tip: "📸 Add a profile photo" },
    { field: "bio", tip: "✍️ Add your bio" },
    { field: "house", tip: "🏠 Add your house" },
    { field: "concentration", tip: "📚 Add your concentration" },
    { field: "hometown", tip: "🌍 Add your hometown" },
    { field: "position", tip: "⚽ Add your position" },
    { field: "phone_number", tip: "📱 Add your phone number" },
    { field: "current_job", tip: "💼 Add your current job" },
    { field: "current_company", tip: "🏢 Add your current company" },
    { field: "current_location", tip: "📍 Add your current location" },
    { field: "linkedin_url", tip: "💼 Add your LinkedIn profile" },
    { field: "instagram_url", tip: "📷 Add your Instagram profile" },
  ];

  // Find the highest priority missing field
  for (const { field, tip } of tipPriority) {
    if (missingFields.includes(field)) {
      return tip;
    }
  }

  // Fallback
  return `Add ${missingFields.length} more field${
    missingFields.length > 1 ? "s" : ""
  } to complete your profile`;
}

function getColor(percentage) {
  if (percentage < PROFILE_COMPLETION.PERCENTAGES.LOW) {
    return PROFILE_COMPLETION.COLORS.LOW;
  }
  if (percentage < PROFILE_COMPLETION.PERCENTAGES.MEDIUM) {
    return PROFILE_COMPLETION.COLORS.MEDIUM;
  }
  return PROFILE_COMPLETION.COLORS.HIGH;
}
