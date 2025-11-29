"use client";

import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDistanceToNow } from "date-fns";

export default function Post({ post, currentUserId, onEdit, onDelete, onToggleLike, onOpenComments }) {
  const { profile, content, created_at, updated_at, likes, comments, image_urls } = post;

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

  // Calculate likes data
  const likesCount = likes?.length || 0;
  const userHasLiked = likes?.some((like) => like.profile_id === currentUserId) || false;

  // Calculate comments count
  const commentsCount = comments?.length || 0;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  const handleLikeClick = () => {
    if (onToggleLike) {
      onToggleLike(post.id);
    }
  };

  const handleCommentsClick = () => {
    if (onOpenComments) {
      onOpenComments(post);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
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
      <div className="flex items-start mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {profile?.profile_image_url ? (
            <Image
              src={profile.profile_image_url}
              alt={profile.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-semibold">
                {profile?.full_name?.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 uppercase text-sm">
                {profile?.full_name}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(created_at)}
                {isEdited && " (edited)"}
              </p>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-[#A51C30] transition-colors p-2"
                title="Edit post"
              >
                <EditIcon fontSize="small" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                title="Delete post"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mb-4">
        {/* EditorContent is a React component from Tiptap responsible for rendering the actual DOM */}
        <EditorContent editor={editor} />
      </div>

      {/* Images */}
      {image_urls && image_urls.length > 0 && (
        <div
          className={`mb-4 grid gap-2 ${
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
              className="relative block overflow-hidden rounded-md group"
            >
              <Image
                src={url}
                alt={`Post image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 transition-colors ${
            userHasLiked
              ? "text-[#A51C30]"
              : "text-gray-600 hover:text-[#A51C30]"
          }`}
        >
          {userHasLiked ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
          <span className="text-sm">{likesCount}</span>
        </button>
        <button
          onClick={handleCommentsClick}
          className="flex items-center gap-2 text-gray-600 hover:text-[#A51C30] transition-colors"
        >
          <ChatBubbleOutlineIcon fontSize="small" />
          <span className="text-sm">{commentsCount}</span>
        </button>
      </div>
    </div>
  );
}
