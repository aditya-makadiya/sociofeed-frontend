import React, { useState, useRef, useCallback } from "react";
import {
  Modal,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Cropper from "react-easy-crop";
import { useDispatch } from "react-redux";
import {
  updateProfile,
  updateAvatar,
  resetAvatar,
} from "../../app/slices/profileSlice";

const EditProfileModal = ({ open, onClose, user, onProfileUpdate }) => {
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target.result);
        setCropModalOpen(true); // Open crop modal
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        );

        canvas.toBlob(
          (blob) => {
            const file = new File([blob], "cropped-avatar.jpg", {
              type: "image/jpeg",
            });
            resolve(file);
          },
          "image/jpeg",
          0.9,
        );
      };
    });
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedFile = await createCroppedImage(
        imageToCrop,
        croppedAreaPixels,
      );
      setAvatar(croppedFile);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(croppedFile);
      setCropModalOpen(false);
      setImageToCrop(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.log(err);

      setError("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(user?.avatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetToDefault = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await dispatch(resetAvatar(user.id));
      if (resetAvatar.fulfilled.match(result)) {
        setAvatarPreview(result.payload.avatar);
        setAvatar(null);
        setSuccess("Avatar reset to default successfully");
        if (onProfileUpdate) {
          onProfileUpdate(result.payload);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Update bio first
      const result = await dispatch(
        updateProfile({ userId: user.id, data: { bio } }),
      );
      if (updateProfile.fulfilled.match(result)) {
        let updatedUser = result.payload;

        // Update avatar if a new one was selected
        if (avatar) {
          const avatarResult = await dispatch(
            updateAvatar({ userId: user.id, file: avatar }),
          );
          if (updateAvatar.fulfilled.match(avatarResult)) {
            updatedUser = avatarResult.payload;
          }
        }

        setSuccess("Profile updated successfully!");

        // Call the callback to update parent component
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }

        // Close modal after a short delay
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBio(user?.bio || "");
      setAvatar(null);
      setAvatarPreview(user?.avatar || "");
      setError("");
      setSuccess("");
      setCropModalOpen(false);
      setImageToCrop(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      onClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: { xs: "90%", sm: "500px" },
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              Edit Profile
            </Typography>
            <IconButton onClick={handleClose} disabled={loading}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Avatar Section */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Typography variant="h6" mb={2}>
              Profile Picture
            </Typography>

            <Avatar
              src={avatarPreview}
              sx={{ width: 120, height: 120, mb: 2 }}
            />

            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                size="small"
              >
                Change Photo
              </Button>

              {avatarPreview && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleResetToDefault}
                  disabled={loading}
                  size="small"
                >
                  Reset to Default
                </Button>
              )}

              {avatar && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  size="small"
                >
                  Remove
                </Button>
              )}
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>

          {/* Bio Section */}
          <Box mb={3}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              disabled={loading}
              inputProps={{ maxLength: 500 }}
              helperText={`${bio.length}/500 characters`}
            />
          </Box>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Crop Modal */}
      <Modal
        open={cropModalOpen}
        onClose={handleCropCancel}
        aria-labelledby="crop-image-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: { xs: "90%", sm: "500px" },
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" component="h2" fontWeight="bold">
              Crop Image
            </Typography>
            <IconButton onClick={handleCropCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ position: "relative", width: "100%", height: 300 }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="body2" mb={1}>
              Zoom
            </Typography>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </Box>

          <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCropSave}>
              Crop & Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditProfileModal;
