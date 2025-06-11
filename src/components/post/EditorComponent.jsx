import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Heading from "@tiptap/extension-heading";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
} from "react-icons/fa";
import { MdFormatSize } from "react-icons/md";
import "./EditorComponent.css"; // Import custom CSS

const buttonClass = (isActive) =>
  `p-2 rounded-md ${
    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
  }`;

const EditorComponent = ({ initialContent, onChange }) => {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const newEditor = new Editor({
      element: editorRef.current,
      extensions: [
        StarterKit.configure({
          bulletList: false,
          orderedList: false,
          listItem: false,
          heading: false,
          blockquote: false,
        }),
        Underline,
        BulletList.configure({
          HTMLAttributes: {
            class: "list-disc pl-6",
          },
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: "list-decimal pl-6",
          },
        }),
        ListItem,
        Heading.configure({
          levels: [1, 2],
          HTMLAttributes: {
            class: "heading",
          },
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: "blockquote",
          },
        }),
      ],
      content: initialContent || "<p></p>",
      onUpdate: ({ editor }) => {
        // console.log("Editor content:", editor.getHTML());
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm w-full p-4 border border-gray-200 rounded-md focus:outline-none min-h-[120px] bg-white text-gray-800 text-left custom-editor",
        },
      },
    });

    setEditor(newEditor);

    return () => {
      newEditor.destroy();
    };
  }, []);

  return (
    <div>
      {editor && (
        <div className="flex items-center gap-2 p-3 border-b border-gray-200 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive("bold"))}
            title="Bold"
          >
            <FaBold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive("italic"))}
            title="Italic"
          >
            <FaItalic size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log("Underline button clicked");
              editor.chain().focus().toggleUnderline().run();
            }}
            className={buttonClass(editor.isActive("underline"))}
            title="Underline"
          >
            <FaUnderline size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log("Bullet List button clicked");
              editor.chain().focus().toggleBulletList().run();
            }}
            className={buttonClass(editor.isActive("bulletList"))}
            title="Bullet List"
          >
            <FaListUl size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log("Ordered List button clicked");
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={buttonClass(editor.isActive("orderedList"))}
            title="Numbered List"
          >
            <FaListOl size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log(
              //   "Heading 1 button clicked, can toggle:",
              //   editor.can().toggleHeading({ level: 1 })
              // );
              editor
                .chain()
                .focus()
                .setParagraph()
                .toggleHeading({ level: 1 })
                .run();
            }}
            className={buttonClass(editor.isActive("heading", { level: 1 }))}
            title="Heading 1"
          >
            <MdFormatSize size={16} />
            <span className="text-xs ml-1">H1</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log(
              //   "Heading 2 button clicked, can toggle:",
              //   editor.can().toggleHeading({ level: 2 })
              // );
              editor
                .chain()
                .focus()
                .setParagraph()
                .toggleHeading({ level: 2 })
                .run();
            }}
            className={buttonClass(editor.isActive("heading", { level: 2 }))}
            title="Heading 2"
          >
            <MdFormatSize size={16} />
            <span className="text-xs ml-1">H2</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // console.log(
              //   "Blockquote button clicked, can toggle:",
              //   editor.can().toggleBlockquote()
              // );
              editor.chain().focus().setParagraph().toggleBlockquote().run();
            }}
            className={buttonClass(editor.isActive("blockquote"))}
            title="Blockquote"
          >
            <FaQuoteRight size={16} />
          </button>
        </div>
      )}
      <div ref={editorRef} />
    </div>
  );
};

export default EditorComponent;
