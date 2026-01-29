"use client";

import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDistanceToNow } from "date-fns";

export default function Post({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onToggleLike,
  onOpenComments,
}) {
  const {
    profile,
    content,
    created_at,
    updated_at,
    likes,
    comments,
    image_urls,
  } = post;

  // useEditor is a React hook from Tiptap that creates and manages an editor instance object with many properties and methods
  const editor = useEditor({
    // StarterKit includes all basic formatting features
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-[#A51C30] underline cursor-pointer",
        },
      }),
    ],
    content: content,
    // Read-only
    editable: false,
    // Configuration for the editor's DOM element (adding CSS classes to style the rendered content)
    editorProps: {
      attributes: {
        class: "tiptap prose prose-sm max-w-none focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  function formatTimestamp(timestamp) {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return timestamp;
    }
  }

  const isEdited = updated_at !== created_at;
  const isOwner = currentUserId === post.profile_id;

  // Calculate likes
  const likesCount = likes?.length || 0;
  const userHasLiked =
    likes?.some((like) => like.profile_id === currentUserId) || false;

  // Calculate comments
  const commentsCount = comments?.length || 0;
  const userHasCommented =
    comments?.some((comment) => comment.profile_id === currentUserId) || false;

  // Event handler (arrow function)
  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  // Event handler (arrow function)
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  // Event handler (arrow function)
  const handleLikeClick = () => {
    if (onToggleLike) {
      onToggleLike(post.id);
    }
  };

  // Event handler (arrow function)
  const handleCommentsClick = () => {
    if (onOpenComments) {
      onOpenComments(post);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-6 relative hover:shadow-l transition-all-smooth">
      <style jsx global>{`
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .tiptap li {
          margin: 0.25rem 0;
        }
      `}</style>
      <div className="flex items-start mb-5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 group/avatar">
          {profile?.profile_image_url ? (
            <Image
              src={profile.profile_image_url}
              alt={profile.full_name}
              fill
              className="object-cover object-top transition-transform duration-300 group-hover/avatar:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-transform duration-300 group-hover/avatar:scale-110">
              <Image
                src="/images/HarvardLogo.svg"
                alt="Harvard Logo"
                width={32}
                height={32}
                className="opacity-50 group-hover/avatar:opacity-70 transition-opacity"
              />
            </div>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">
                {profile?.full_name}
                {profile?.graduation_year && (
                  <span className="font-normal italic text-sm text-gray-500 ml-1">
                    '{String(profile.graduation_year).slice(-2)}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {formatTimestamp(created_at)}
                {isEdited && " (edited)"}
              </p>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all-smooth p-2"
                title="Edit post"
              >
                <EditIcon fontSize="small" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all-smooth p-2"
                title="Delete post"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mb-5 text-gray-700 leading-relaxed">
        {/* EditorContent is a React component from Tiptap responsible for rendering the actual DOM */}
        <EditorContent editor={editor} />
      </div>

      {/* Images */}
      {image_urls && image_urls.length > 0 && (
        <div
          className={`mb-8 grid gap-5 ${
            image_urls.length === 1
              ? "grid-cols-1"
              : image_urls.length === 2
                ? "grid-cols-2"
                : image_urls.length === 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
          }`}
        >
          {image_urls.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-lg group ring-1 ring-gray-200 shadow-md hover:shadow-xl transition-all-smooth"
            >
              <Image
                src={url}
                alt={`Post image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center gap-8 pt-5 border-t-2 border-gray-100">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all-smooth font-medium ${
            userHasLiked
              ? "text-[#A51C30] bg-red-50 hover:bg-red-100"
              : "text-gray-600 hover:text-[#A51C30] hover:bg-gray-50"
          }`}
        >
          {userHasLiked ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
          <span className="text-sm font-semibold">{likesCount}</span>
        </button>
        <button
          onClick={handleCommentsClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all-smooth font-medium ${
            userHasCommented
              ? "text-[#A51C30] bg-red-50 hover:bg-red-100"
              : "text-gray-600 hover:text-[#A51C30] hover:bg-gray-50"
          }`}
        >
          {userHasCommented ? (
            <ChatBubbleIcon fontSize="small" />
          ) : (
            <ChatBubbleOutlineIcon fontSize="small" />
          )}
          <span className="text-sm font-semibold">{commentsCount}</span>
        </button>
      </div>
    </div>
  );
}
