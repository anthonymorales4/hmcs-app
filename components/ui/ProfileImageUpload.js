"use client";

import { supabase } from "../../lib/supabase";
import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGE_UPLOAD, ERROR_MESSAGES } from "../../lib/constants";

export default function ProfileImageUpload({ profile, onImageUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const profile_image_url = profile?.profile_image_url || "/HarvardLogo.svg";

  function validateFile(file) {
    if (!IMAGE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(ERROR_MESSAGES.IMAGE_INVALID_TYPE);
    }

    if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
      throw new Error(ERROR_MESSAGES.IMAGE_TOO_LARGE);
    }
  }

  function generateFileName(file) {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    return `${profile.id}/${timestamp}.${extension}`;
  }

  async function deleteImage() {
    if (
      profile.profile_image_url &&
      !profile.profile_image_url.includes("HarvardLogo.svg")
    ) {
      try {
        const url = new URL(profile.profile_image_url);
        const pathParts = url.pathname.split("/");
        const filePath = pathParts.slice(-2).join("/");

        const { error } = await supabase.storage
          .from("profile-images")
          .remove([filePath]);

        if (error) {
          console.warn("Failed to delete image: ", error);
        }
      } catch (error) {
        console.warn("Error parsing image URL: ", error);
      }
    }
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      validateFile(file);
      const fileName = generateFileName(file);
      await deleteImage();

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      if (onImageUpdate) {
        onImageUpdate({
          ...profile,
          profile_image_url: imageUrl,
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (
      !profile.profile_image_url ||
      profile.profile_image_url.includes("HarvardLogo.svg")
    ) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await deleteImage();

      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: null })
        .eq("id", profile.id);

      if (error) throw error;

      if (onImageUpdate) {
        onImageUpdate({
          ...profile,
          profile_image_url: null,
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative group">
      <div className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full overflow-hidden border-4 border-[#A51C30] shadow-lg">
        <Image
          src={profile_image_url}
          alt={profile?.full_name || "Profile"}
          fill
          className="object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Upload
              </button>
              {profile?.profile_image_url &&
                !profile.profile_image_url.includes("HarvardLogo.svg") && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={isUploading}
                    className="bg-[#A51C30] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#8B1721] transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
