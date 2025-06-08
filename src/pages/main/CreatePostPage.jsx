import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { createPost } from "../../app/slices/postSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/notifications/toastUtils";
import {
  FaTimes,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from "react-icons/fa";

export default function CreatePostPage() {
  const [editor, setEditor] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState([]);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug component mount and unmount
  useEffect(() => {
    console.log("CreatePostPage mounted");
    return () => {
      console.log("CreatePostPage unmounted");
    };
  }, []);

  // Initialize TipTap editor
  useEffect(() => {
    console.log(
      "Editor initialization useEffect, editorRef.current:",
      editorRef.current,
    );

    const initializeEditor = () => {
      if (!editorRef.current) {
        console.error("Editor ref not set, cannot initialize editor");
        return;
      }

      // Clear existing content in the editor container to prevent stale editors
      editorRef.current.innerHTML = "";

      try {
        const newEditor = new Editor({
          element: editorRef.current,
          extensions: [StarterKit, Underline],
          content: "<p>Start typing here...</p>",
          editorProps: {
            attributes: {
              class:
                "prose prose-sm w-full p-4 border border-gray-200 rounded-md focus:outline-none min-h-[120px] bg-white text-gray-800",
            },
          },
        });
        console.log("Editor initialized:", newEditor);
        setEditor(newEditor);
      } catch (error) {
        console.error("Error initializing TipTap editor:", error);
      }
    };

    initializeEditor();

    // Cleanup editor on unmount
    return () => {
      if (editor) {
        console.log("Destroying editor on cleanup");
        editor.destroy();
        setEditor(null);
      }
      if (editorRef.current) {
        console.log("Clearing editor container on cleanup");
        editorRef.current.innerHTML = "";
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // Log number of editors in DOM for debugging
  useEffect(() => {
    const checkEditors = () => {
      const editors = document.querySelectorAll(".tiptap");
      console.log(
        `Number of TipTap editors in DOM: ${editors.length}`,
        editors,
      );
    };
    checkEditors();
    const interval = setInterval(checkEditors, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      showErrorToast("You can upload a maximum of 4 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));
    setImages([...images, ...newImages]);
    setImageUploading([...imageUploading, ...newImages.map(() => false)]);
  };

  // Remove selected image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedUploading = imageUploading.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImageUploading(updatedUploading);
    URL.revokeObjectURL(images[index].preview);
  };

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || uploading) {
      console.log("Submit blocked: editor:", !!editor, "uploading:", uploading);
      return;
    }

    const content = editor.getHTML();
    if (!content.trim() && images.length === 0) {
      showErrorToast("Post content or images are required.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("content", content);
    images.forEach((image, index) => {
      formData.append("images", image.file);
      setImageUploading((prev) => {
        const newUploading = [...prev];
        newUploading[index] = true;
        return newUploading;
      });
    });

    try {
      await dispatch(createPost(formData)).unwrap();

      showSuccessToast("Post created successfully!");
      editor.commands.clearContent();
      setImages([]);
      setImageUploading([]);
      navigate("/");
    } catch (error) {
      showErrorToast(error || "Failed to create post.");
    } finally {
      setUploading(false);
      setImageUploading(images.map(() => false));
    }
  };

  // Toolbar button styles
  const buttonClass = (isActive) =>
    `p-2 rounded-md ${
      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-full p-8 bg-gray-50 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TipTap Editor with Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
          {/* Toolbar */}
          {editor && (
            <div className="flex items-center gap-2 p-3 border-b border-gray-200">
              <button
                type="button"
                onClick={() => {
                  console.log("Bold button clicked");
                  editor.chain().focus().toggleBold().run();
                }}
                className={buttonClass(editor.isActive("bold"))}
                title="Bold"
              >
                <FaBold size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Italic button clicked");
                  editor.chain().focus().toggleItalic().run();
                }}
                className={buttonClass(editor.isActive("italic"))}
                title="Italic"
              >
                <FaItalic size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Underline button clicked");
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
                  console.log("Bullet List button clicked");
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
                  console.log("Ordered List button clicked");
                  editor.chain().focus().toggleOrderedList().run();
                }}
                className={buttonClass(editor.isActive("orderedList"))}
                title="Numbered List"
              >
                <FaListOl size={16} />
              </button>
            </div>
          )}
          {/* Editor */}
          <div
            id="tiptap-editor"
            key="tiptap-editor"
            ref={editorRef}
            className="w-full min-h-[120px]"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (up to 4)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md shadow-sm"
                />
                {imageUploading[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Posting...
            </div>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
}
