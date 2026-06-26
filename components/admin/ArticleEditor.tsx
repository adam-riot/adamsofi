"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

export default function ArticleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tulis artikel di sini..." }),
    ],
    content: value,
    editorProps: { attributes: { class: "tiptap" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // keep external value in sync when loading an existing article
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return <div className="tiptap-wrap"><div className="tiptap" /></div>;

  const btn = (active: boolean, on: () => void, label: string) => (
    <button type="button" className={`tt-btn ${active ? "on" : ""}`} onClick={on}>{label}</button>
  );

  return (
    <div className="tiptap-wrap">
      <div className="tt-bar">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "B")}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "i")}
        {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2")}
        {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3")}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "• List")}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "1. List")}
        {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "❝")}
        {btn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), "</>")}
        {btn(false, () => {
          const url = prompt("URL pautan:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }, "Link")}
        {btn(false, () => {
          const url = prompt("URL imej:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }, "Imej")}
        {btn(false, () => editor.chain().focus().undo().run(), "↶")}
        {btn(false, () => editor.chain().focus().redo().run(), "↷")}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
