"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  validateImageFile,
  generateImageFileName,
  extractFileNameFromUrl,
} from "../../lib/utils";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function ProfileImageUpload({
  profile,
  isEditing,
  onImageUpdate,
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const hasProfileImage = profile?.profile_image_url;

  async function handleUploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageValidation = validateImageFile(file);
    if (imageValidation.error) {
      setUploadError(imageValidation.error);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      if (hasProfileImage) {
        const currentFileName = extractFileNameFromUrl(
          profile.profile_image_url
        );
        await supabase.storage
          .from("profile-images")
          .remove([`${profile.id}/${currentFileName}`]);
      }

      const newFileName = generateImageFileName(file.name);
      const newFilePath = `${profile.id}/${newFileName}`;

      const { error: uploadImageError } = await supabase.storage
        .from("profile-images")
        .upload(newFilePath, file, {
          // Cache image for 1 hour (3600 seconds)
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadImageError) throw uploadImageError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(newFilePath);

      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ profile_image_url: publicUrl })
        .eq("id", profile.id);

      if (updateProfileError) throw updateProfileError;

      if (onImageUpdate) {
        onImageUpdate({
          ...profile,
          profile_image_url: publicUrl,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input field by clearing its value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleEditClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="relative w-32 h-32 flex-shrink-0 group">
      {profile?.profile_image_url ? (
        <Image
          src={profile.profile_image_url}
          alt={profile?.full_name}
          fill
          className="rounded-full object-cover object-top ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/images/HarvardLogo.svg"
            alt="Harvard Logo"
            width={64}
            height={64}
            className="opacity-50 group-hover:opacity-70 transition-opacity"
          />
        </div>
      )}

      {/* Edit/Add button - always visible on hover */}
      <button
        type="button"
        onClick={handleEditClick}
        disabled={isUploading}
        className="absolute -top-1 -left-1 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {hasProfileImage ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleUploadImage}
        className="hidden"
      />

      {/* Uploading state */}
      {isUploading && (
        <div className="absolute inset-0 rounded-full bg-white/60 animate-pulse" />
      )}
      {/* TODO - Standardize error state */}
      {uploadError && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-50 text-red-700 text-xs p-2 rounded-md shadow-lg whitespace-nowrap">
          {uploadError}
        </div>
      )}
    </div>
  );
}
