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
  const [isEditMode, setIsEditMode] = useState(false);
  const [postBeingEdited, setPostBeingEdited] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Helper function (arrow function)
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

  // fetchPosts is an async function wrapped in useCallback hook
  // useCallback is a React hook that helps you avoid recreating functions on every render
  // It memoizes a function and only creates a new version when its dependencies change
  // Typically used in functions used as dependencies in useEffect
  const fetchPosts = useCallback(
    // Default parameter
    // false is a fallback value, not a fixed value
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setLoadingMore(true); // Show "loading more" spinner
        } else {
          setLoading(true); // Show initial loading spinner
          setError(null);
        }

        const POSTS_PER_PAGE = 15;
        const from = loadMore ? posts.length : 0;
        const to = from + POSTS_PER_PAGE - 1;

        const { data, error: fetchError } = await supabase
          .from("posts")
          // profile:profiles(*) -> Gets the author of the post
          // likes(profile_id) -> To check if the current user has liked the post and total likes
          // comments(id) -> To check total comments
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
          setPosts((prevPosts) => [...prevPosts, ...data]); // Add new posts
        } else {
          setPosts(data);
        }

        setHasMore(data && data.length === POSTS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // fetchPosts only recreates when posts.length changes
    // Dependency array
    [posts.length]
  );

  // Event handler (arrow function)
  const handleLoadMore = () => {
    fetchPosts(true);
  };

  // Runs on initial mount and whenever posts.length changes
  useEffect(() => {
    getCurrentUser();
    fetchPosts();
  }, [fetchPosts]);

  // Event handler (arrow function)
  const handleSubmitPost = async () => {
    // Check if content is empty
    if (
      !postContent ||
      !postContent.content ||
      postContent.content.length === 0
    ) {
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

      const uploadedImageUrls = [];

      // Generate unique file names
      for (const file of selectedImages) {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${currentUserId}/${Date.now()}_${Math.random()
          .toString(36) // Comverts the number to base-36 (compact and URL-safe)
          .substring(7)}.${fileExtension}`; // Removea the first 7 characters

        // Uploading images to Supabase storage
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

      // Add new images while keeping existing ones
      // uploadedImageUrls -> Contains only new URLs
      // imagePreviewUrls -> Contains both existing and new URLs
      let updatedImageUrls = uploadedImageUrls;
      if (isEditMode && imagePreviewUrls.length > selectedImages.length) {
        // Keep existing URLs
        const existingImageUrls = imagePreviewUrls.filter(
          (url) => url.startsWith("http") // Prefix used for URLs stored in Supabase
        );
        updatedImageUrls = [...existingImageUrls, ...uploadedImageUrls];
      }

      if (isEditMode) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            content: postContent,
            image_urls: updatedImageUrls,
            updated_at: new Date().toISOString(),
          })
          .eq("id", postBeingEdited.id);

        if (updateError) throw updateError;
      } else {
        // Create new post
        const { error: insertError } = await supabase.from("posts").insert({
          profile_id: currentUserId,
          content: postContent,
          image_urls: updatedImageUrls,
        });

        if (insertError) throw insertError;
      }

      setIsModalOpen(false); // Hide modal
      setPostContent(""); // Empty text editor
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setIsEditMode(false); // Switch back to "create new post" in modal
      setPostBeingEdited(null); // Remove reference to the post that was being edited
      await fetchPosts(); // Show newly created/edited post in the feed without manual refresh
    } catch (err) {
      console.error("Error submitting post:", err);
      setSubmitError(
        isEditMode
          ? "Failed to edit post. Please try again."
          : "Failed to create post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Event handler (arrow function)
  const handleEditPost = (post) => {
    setPostBeingEdited(post);
    setPostContent(post.content);
    setIsEditMode(true);
    setIsModalOpen(true);
    // Show existing images in modal
    if (post.image_urls && post.image_urls.length > 0) {
      setImagePreviewUrls(post.image_urls);
    }
  };

  // Event handler (arrow function)
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Check total number of images
    // selectedImages -> Images that have already been selected
    // files -> Newly selected images
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

    // Create new image preview URLs
    // URL.createObjectURL(file) is used to transform a File object into a URL to immediately be used for previews
    // Stored in the browser's memory, not the server
    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
  };

  // Event handler (arrow function)
  // index -> Refers to which images to remove (0 for first, 1 for second, etc.)
  const handleRemoveImage = (index) => {
    // Keep all images except for the one at index
    const updatedSelectedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedSelectedImages);

    // Revoke preview URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    // Keep all image URLs except for the one at index
    const updatedImagePreviewUrls = imagePreviewUrls.filter(
      (_, i) => i !== index
    );
    setImagePreviewUrls(updatedImagePreviewUrls);
  };

  // Event handler (arrow function)
  const handleDeletePost = async (postId) => {
    try {
      // Find the post
      const deletedPost = posts.find((post) => post.id === postId);

      // Check if deleted post has images to delete
      if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
        for (const imageUrl of deletedPost.image_urls) {
          // imageUrl -> Full image URL from Supabase
          const urlParts = imageUrl.split("/post-images/");
          if (urlParts.length > 1) {
            // Extract file path from URL
            const filePath = urlParts[1];
            await supabase.storage.from("post-images").remove([filePath]);
          }
        }
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) throw deleteError;

      await fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Event handler (arrow function)
  const handleToggleLike = async (postId) => {
    // Check if user is logged in
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
        .single(); // Converts result from an array to an object, assuming there will only be one result

      if (existingLike) {
        // If like already exists, dislike post
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("profile_id", currentUserId);

        if (deleteError) throw deleteError;
      } else {
        // If like doesn't already exist, like post
        const { error: insertError } = await supabase.from("likes").insert({
          post_id: postId,
          profile_id: currentUserId,
        });

        if (insertError) throw insertError;
      }

      await fetchPosts();
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  // Event handler (arrow function)
  const handleOpenComments = async (post) => {
    setSelectedPost(post);
    setIsCommentsModalOpen(true); // Open comments modal
    await fetchComments(post.id);
  };

  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);

      // profile:profiles(*) -> Join with profiles table
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
      alert("Failed to fetch comments. Please try again.");
    } finally {
      setLoadingComments(false);
    }
  };

  // Event handler (arrow function)
  const handleSubmitComment = async () => {
    // Check for empty comment
    if (!newComment.trim()) {
      return;
    }

    // Check if user is logged in
    if (!currentUserId) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      setSubmittingComment(true);

      // Insert new comment into database
      const { error: insertError } = await supabase.from("comments").insert({
        post_id: selectedPost.id,
        profile_id: currentUserId,
        content: newComment.trim(),
      });

      if (insertError) throw insertError;

      setNewComment("");
      await fetchComments(selectedPost.id);
      await fetchPosts();
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Event handler (arrow function)
  const handleDeleteComment = async (commentId) => {
    // confirm() is a built-in browser function that show a popup
    // Returns true of user clicks "OK"
    // Returns false is user clicks "Cancel"
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      // Delete comments from database
      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) throw deleteError;

      await fetchComments(selectedPost.id);
      await fetchPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  // Event handler (arrow function)
  const handleNewPost = () => {
    setIsEditMode(false);
    setPostBeingEdited(null);
    setPostContent("");
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsModalOpen(true);
  };

  // Event handler (arrow function)
  const handleCancelPost = () => {
    setIsModalOpen(false);
    setPostContent("");
    setSubmitError(null);
    setIsEditMode(false);
    setPostBeingEdited(null);
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              // Event handler is an anonymous arrow function defined inline
              onClick={handleNewPost}
              className="bg-[#A51C30] text-white px-4 py-2 rounded-md hover:bg-[#8B1828] transition-colors font-medium"
            >
              New Post +
            </button>
          </div>
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
      {isModalOpen && (
        // Backdrop/overlay that causes the modal to close when clicking outside of it
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* e.stopPropagation() prevents the modal from closing when you click inside it */}
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Announcement" : "Create Announcement"}
              </h2>
            </div>
            <div className="px-6 py-4">
              <TextEditor content={postContent} onChange={setPostContent} />
              <div className="mt-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer w-fit">
                  <AddPhotoAlternateIcon fontSize="small" />
                  <span className="text-sm font-medium">Add Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={submitting || imagePreviewUrls.length >= 4}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Up to 4 images, max 5MB each
                </p>
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-32">
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover rounded-md border border-gray-300"
                          />
                        </div>
                        <button
                          type="button"
                          // Anonymous arrow function calls handleRemoveImage(index)
                          // Stores function for later instead of when component renders
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Remove image"
                        >
                          <CloseIcon fontSize="medium" />
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
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => handleCancelPost()}
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
      {isCommentsModalOpen && selectedPost && (
        // Backdrop/overlay that causes the modal to close when clicking outside of it
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCommentsModalOpen(false)}
        >
          {/* e.stopPropagation() prevents the modal from closing when you click inside it */}
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            </div>
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <Post
                post={selectedPost}
                currentUserId={currentUserId}
                onDelete={null}
                onToggleLike={null}
                onOpenComments={null}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingComments ? (
                // Loading skeleton
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
                        <p className="text-sm text-gray-700">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
