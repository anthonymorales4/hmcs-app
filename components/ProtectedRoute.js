"use client";

import { useAuth } from "../contexts/AuthContext";
import LockIcon from "@mui/icons-material/Lock";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A51C30]"></div>
      </div>
    );
  }

  // If user is not authenticated, show lock screen
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <LockIcon 
            className="text-gray-400 mb-4" 
            style={{ fontSize: '4rem' }}
          />
          <p className="text-gray-500 text-lg">
            Please log in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  return children;
}