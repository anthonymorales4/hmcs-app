"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";

export default function TextEditor({ content, onChange }) {
  const editor = useEditor({
    // Prevents SSR hydration issues
    // Editor waits until client-side to render
    immediatelyRender: false,
    extensions: [
      StarterKit,
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
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 border border-gray-300 rounded-md",
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Nested component
  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "bg-gray-300 text-[#A51C30]" : "text-gray-700"
      }`}
      title={label}
    >
      <Icon fontSize="small" />
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        <ToolbarButton
          // Uses a command chain
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={FormatBoldIcon}
          label="Bold"
        />
        <ToolbarButton
          // Uses a command chain
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={FormatItalicIcon}
          label="Italic"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
