// components/feed/CreatePost.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createPost } from "../../app/slices/postSlice"; // Adjust the import based on your structure
import {
  Button,
  // TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const CreatePost = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // Get the HTML content from Tiptap
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // Prevent empty posts

    const formData = new FormData();
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("files", file); // Append each file to the form data
    });

    try {
      await dispatch(createPost(formData)); // Dispatch the create post action
      editor.commands.clearContent(); // Clear the editor after submission
      setContent(""); // Reset content state
      setFiles([]); // Reset files
      setOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length <= 4) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    } else {
      alert("You can upload a maximum of 4 files.");
    }
  };

  return (
    <>
      <div
        className="border rounded-md p-4 mb-4 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <p>What's on your mind?</p>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="border rounded-md p-2">
            <EditorContent editor={editor} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePost;
