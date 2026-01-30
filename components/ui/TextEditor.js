"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

export default function TextEditor({ content, onChange }) {
  const editor = useEditor({
    // Prevents SSR hydration issues
    // Editor waits until client-side to render
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#A51C30] underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Share your announcement...",
      }),
    ],
    content: content,
    editable: true,
    // Callback function
    onUpdate: ({ editor }) => {
      // editor.getJSON() returns the current content as a JSON object
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm max-w-none focus:outline-none min-h-[150px] p-5 bg-white text-gray-700 leading-relaxed",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Nested component
  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all-smooth text-gray-500 cursor-pointer ${
        isActive ? "bg-gray-200 shadow-sm" : "hover:bg-gray-100"
      }`}
      title={label}
    >
      <Icon fontSize="small" />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md focus-within:shadow-lg focus-within:border-gray-300 transition-all-smooth">
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
      <div className="flex items-center gap-2 p-3 bg-gray-50 border-b-2 border-b-gray-100 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={FormatBoldIcon}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={FormatItalicIcon}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={FormatUnderlinedIcon}
          label="Underline"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={handleSetLink}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          label="Add Link"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={FormatListBulletedIcon}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={FormatListNumberedIcon}
          label="Numbered List"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
