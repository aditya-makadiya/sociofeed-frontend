import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditorComponent from "../../components/post/EditorComponent";
import ImageUploader from "../../components/post/ImageUploader";
import SubmitButton from "../../components/post/SubmitButton";
import { createPost } from "../../app/slices/postSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/notifications/toastUtils";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageChange = (files) => {
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

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedUploading = imageUploading.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImageUploading(updatedUploading);
    URL.revokeObjectURL(images[index].preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

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
      setContent("");
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

  return (
    <div className="w-full p-8 bg-gray-50 rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <EditorComponent
          initialContent={content}
          onChange={handleContentChange}
        />
        <ImageUploader
          images={images}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          imageUploading={imageUploading}
        />
        <SubmitButton isLoading={uploading} text="Create Post" />
      </form>
    </div>
  );
}
