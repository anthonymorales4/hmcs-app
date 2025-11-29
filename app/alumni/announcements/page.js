"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Post from "../../../components/ui/Post";
import TextEditor from "../../../components/ui/TextEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../../lib/supabase";

export default function AlumniAnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [postBeingEdited, setPostBeingEdited] = useState(null);

  // Image upload state
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Comments modal state
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

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

  const fetchPosts = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const POSTS_PER_PAGE = 15;
        const from = loadMore ? posts.length : 0;
        const to = from + POSTS_PER_PAGE - 1;

        const { data, error: fetchError } = await supabase
          .from("posts")
          .select(
            `
          *,
          profile:profiles(*),
          likes(profile_id),
          comments(id)
        `
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;

        if (loadMore) {
          setPosts((prevPosts) => [...prevPosts, ...(data || [])]);
        } else {
          setPosts(data || []);
        }

        // Check if there are more posts to load
        setHasMore(data && data.length === POSTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [posts.length]
  );

  const handleLoadMore = () => {
    fetchPosts(true);
  };

  useEffect(() => {
    getCurrentUser();
    fetchPosts();
  }, [fetchPosts]);

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

      // Upload images to Supabase Storage
      const uploadedImageUrls = [];

      for (const file of selectedImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${currentUserId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        uploadedImageUrls.push(data.publicUrl);
      }

      // Combine with existing image URLs if editing
      let finalImageUrls = uploadedImageUrls;
      if (isEditMode && imagePreviewUrls.length > selectedImages.length) {
        // Keep existing URLs that weren't removed
        const existingUrls = imagePreviewUrls.filter((url) => url.startsWith("http"));
        finalImageUrls = [...existingUrls, ...uploadedImageUrls];
      }

      if (isEditMode) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            content: postContent,
            image_urls: finalImageUrls,
            updated_at: new Date().toISOString(),
          })
          .eq("id", postBeingEdited.id);

        if (updateError) throw updateError;
      } else {
        // Create new post
        const { error: insertError } = await supabase.from("posts").insert({
          profile_id: currentUserId,
          content: postContent,
          image_urls: finalImageUrls,
        });

        if (insertError) throw insertError;
      }

      // Success: close modal, clear content, refetch posts
      setIsModalOpen(false);
      setPostContent("");
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setIsEditMode(false);
      setPostBeingEdited(null);
      await fetchPosts();
    } catch (err) {
      console.error("Error submitting post:", err);
      setSubmitError(
        isEditMode
          ? "Failed to update post. Please try again."
          : "Failed to create post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPost = (post) => {
    setPostBeingEdited(post);
    setPostContent(post.content);
    setIsEditMode(true);
    setIsModalOpen(true);
    // Pre-populate images if editing
    if (post.image_urls && post.image_urls.length > 0) {
      setImagePreviewUrls(post.image_urls);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Check total count
    if (selectedImages.length + files.length > 4) {
      alert("You can only upload up to 4 images per post.");
      return;
    }

    // Check file sizes (5MB limit)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("Some files are too large. Maximum size is 5MB per image.");
      return;
    }

    // Add to selected images
    setSelectedImages([...selectedImages, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    // Remove from selected images
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newSelectedImages);

    // Revoke and remove preview URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleDeletePost = async (postId) => {
    try {
      // Get the post to find its images
      const postToDelete = posts.find((p) => p.id === postId);

      // Delete images from storage if they exist
      if (postToDelete?.image_urls && postToDelete.image_urls.length > 0) {
        for (const imageUrl of postToDelete.image_urls) {
          // Extract file path from public URL
          const urlParts = imageUrl.split("/post-images/");
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from("post-images").remove([filePath]);
          }
        }
      }

      // Delete the post from database
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

  const handleOpenComments = async (post) => {
    setSelectedPost(post);
    setIsCommentsModalOpen(true);
    await fetchComments(post.id);
  };

  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);

      const { data, error: fetchError } = await supabase
        .from("comments")
        .select(
          `
          *,
          profile:profiles(*)
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    if (!currentUserId) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      setSubmittingComment(true);

      const { error: insertError } = await supabase.from("comments").insert({
        post_id: selectedPost.id,
        profile_id: currentUserId,
        content: newComment.trim(),
      });

      if (insertError) throw insertError;

      // Clear input and refetch comments
      setNewComment("");
      await fetchComments(selectedPost.id);
      await fetchPosts(); // Update comment count in main feed
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) throw deleteError;

      await fetchComments(selectedPost.id);
      await fetchPosts(); // Update comment count in main feed
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
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
              onClick={() => {
                setIsEditMode(false);
                setPostBeingEdited(null);
                setPostContent("");
                setSelectedImages([]);
                setImagePreviewUrls([]);
                setIsModalOpen(true);
              }}
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
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  onToggleLike={handleToggleLike}
                  onOpenComments={handleOpenComments}
                />
              ))
            )}

            {/* Load More Button */}
            {!loading && !error && posts.length > 0 && hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-[#A51C30] text-white rounded-md hover:bg-[#8B1828] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
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
                {isEditMode ? "Edit Announcement" : "Create Announcement"}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <TextEditor content={postContent} onChange={setPostContent} />

              {/* Image Upload Section */}
              <div className="mt-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer w-fit">
                  <AddPhotoAlternateIcon fontSize="small" />
                  <span className="text-sm font-medium">Add Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={submitting || imagePreviewUrls.length >= 4}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Up to 4 images, max 5MB each
                </p>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Remove image"
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                  setIsEditMode(false);
                  setPostBeingEdited(null);
                  setSelectedImages([]);
                  setImagePreviewUrls([]);
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
                {submitting
                  ? isEditMode
                    ? "Saving..."
                    : "Posting..."
                  : isEditMode
                  ? "Save"
                  : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentsModalOpen && selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCommentsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            </div>

            {/* Post Content (Read-only) */}
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <Post
                post={selectedPost}
                currentUserId={currentUserId}
                onDelete={null}
                onToggleLike={null}
                onOpenComments={null}
              />
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingComments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {/* Comment author profile picture */}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        {comment.profile?.profile_image_url ? (
                          <Image
                            src={comment.profile.profile_image_url}
                            alt={comment.profile.full_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-semibold">
                              {comment.profile?.full_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Comment content */}
                      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {comment.profile?.full_name}
                          </p>
                          {comment.profile_id === currentUserId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete comment"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submittingComment) {
                      handleSubmitComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
                  disabled={submittingComment}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  className="px-4 py-2 bg-[#A51C30] text-white rounded-md hover:bg-[#8B1828] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
