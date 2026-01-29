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
import CloseIcon from "@mui/icons-material/Close";

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

  async function handleDeleteImage() {
    if (!hasProfileImage) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const currentFileName = extractFileNameFromUrl(profile.profile_image_url);
      await supabase.storage
        .from("profile-images")
        .remove([`${profile.id}/${currentFileName}`]);

      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ profile_image_url: null })
        .eq("id", profile.id);

      if (updateProfileError) throw updateProfileError;

      if (onImageUpdate) {
        onImageUpdate({
          ...profile,
          profile_image_url: null,
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadError("Failed to delete image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleEditClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <Image
        src={profile?.profile_image_url || "/images/HarvardLogo.svg"}
        alt={profile?.full_name}
        fill
        className="rounded-full object-cover object-top ring-1 ring-gray-200"
      />

      {isEditing && (
        <>
          <button
            type="button"
            onClick={handleEditClick}
            disabled={isUploading}
            className="absolute -top-1 -left-1 w-8 h-8 bg-[#A51C30] hover:bg-[#8B1721] text-white rounded-full shadow-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasProfileImage ? <EditIcon /> : <AddIcon />}
          </button>
          {hasProfileImage && (
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={isUploading}
              className="absolute -top-1 -right-1 w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloseIcon />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleUploadImage}
            className="hidden"
          />
          {/* TODO - Standardize uploading state */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </>
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
