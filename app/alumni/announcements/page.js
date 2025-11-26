"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Post from "../../../components/ui/Post";
import TextEditor from "../../../components/ui/TextEditor";
import { supabase } from "../../../lib/supabase";

export default function AlumniAnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (err) {
      console.error("Error getting current user:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("posts")
        .select(
          `
          *,
          profile:profiles(*),
          likes(profile_id)
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load announcements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchPosts();
  }, []);

  const handleSubmitPost = async () => {
    // Validate content is not empty
    if (!postContent || !postContent.content || postContent.content.length === 0) {
      setSubmitError("Post content cannot be empty.");
      return;
    }

    // Check if user is authenticated
    if (!currentUserId) {
      setSubmitError("You must be logged in to post.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const { error: insertError } = await supabase.from("posts").insert({
        profile_id: currentUserId,
        content: postContent,
      });

      if (insertError) throw insertError;

      // Success: close modal, clear content, refetch posts
      setIsModalOpen(false);
      setPostContent("");
      await fetchPosts();
    } catch (err) {
      console.error("Error submitting post:", err);
      setSubmitError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) throw deleteError;

      // Refetch posts to update the list
      await fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleToggleLike = async (postId) => {
    if (!currentUserId) {
      alert("You must be logged in to like posts.");
      return;
    }

    try {
      // Check if user has already liked this post
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("profile_id", currentUserId)
        .single();

      if (existingLike) {
        // Unlike - delete the like
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("profile_id", currentUserId);

        if (deleteError) throw deleteError;
      } else {
        // Like - insert a new like
        const { error: insertError } = await supabase
          .from("likes")
          .insert({
            post_id: postId,
            profile_id: currentUserId,
          });

        if (insertError) throw insertError;
      }

      // Refetch posts to update like counts
      await fetchPosts();
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Announcements
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Latest news and announcements for alumni.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#A51C30] text-white px-4 py-2 rounded-md hover:bg-[#8B1828] transition-colors font-medium"
            >
              New Post +
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="ml-3 flex-grow">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center text-red-600">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No announcements yet. Be the first to post!
              </div>
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onDelete={handleDeletePost}
                  onToggleLike={handleToggleLike}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create Announcement
              </h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <TextEditor content={postContent} onChange={setPostContent} />
              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {submitError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPostContent("");
                  setSubmitError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPost}
                disabled={submitting}
                className="px-4 py-2 bg-[#A51C30] text-white rounded-md hover:bg-[#8B1828] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
