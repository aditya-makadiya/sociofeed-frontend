import React from "react";
import { Modal, Box, Typography, IconButton, Alert } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import useEditProfileForm from "../../hooks/useEditProfileForm";
import useAvatarCropper from "../../hooks/useAvatarCropper";
import AvatarEditor from "./AvatarEditor";
import ProfileForm from "./ProfileForm";
import FormActions from "./FormActions.jsx";
import CropModal from "./CropModal";

const EditProfileModal = ({ open, onClose, user, onProfileUpdate }) => {
  const {
    bio,
    setBio,
    username,
    setUsername,
    // avatar,
    setAvatar,
    avatarPreview,
    setAvatarPreview,
    loading,
    error,
    success,
    // fileInputRef,
    handleSubmit,
    resetForm,
  } = useEditProfileForm(user, onProfileUpdate, onClose);
  const {
    cropModalOpen,
    imageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    // croppedAreaPixels,
    onCropComplete,
    fileInputRef: cropFileInputRef,
    handleAvatarChange,
    handleCropSave,
    handleCropCancel,
    handleRemoveAvatar,
    handleResetToDefault,
  } = useAvatarCropper(user, setAvatar, setAvatarPreview);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          resetForm();
          onClose();
        }}
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
            <Typography variant="h5" component="h2" fontWeight="bold">
              Edit Profile
            </Typography>
            <IconButton
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Box>
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
          <AvatarEditor
            avatarPreview={avatarPreview}
            onAvatarChange={(e) => {
              const { error } = handleAvatarChange(e);
              if (error) setError(error);
            }}
            onRemoveAvatar={() => {
              handleRemoveAvatar();
              setError("");
            }}
            onResetAvatar={async () => {
              const { error, success, updatedUser } =
                await handleResetToDefault();
              if (error) setError(error);
              else {
                setSuccess(success);
                onProfileUpdate(updatedUser);
              }
            }}
            fileInputRef={cropFileInputRef}
            loading={loading}
          />
          <ProfileForm
            username={username}
            bio={bio}
            onUsernameChange={setUsername}
            onBioChange={setBio}
            loading={loading}
          />
          <FormActions
            loading={loading}
            onCancel={() => {
              resetForm();
              onClose();
            }}
            onSubmit={async () => {
              await handleSubmit();
              setError("");
            }}
          />
        </Box>
      </Modal>
      <CropModal
        cropModalOpen={cropModalOpen}
        handleCropCancel={handleCropCancel}
        imageToCrop={imageToCrop}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        handleCropSave={async () => {
          const { error } = await handleCropSave();
          if (error) setError(error);
        }}
      />
    </>
  );
};

export default EditProfileModal;
