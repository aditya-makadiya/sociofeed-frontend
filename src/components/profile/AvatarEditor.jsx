import React, { memo } from "react";
import { Avatar, Button, Typography, Box } from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const AvatarEditor = memo(
  ({
    avatarPreview,
    onAvatarChange,
    onRemoveAvatar,
    onResetAvatar,
    fileInputRef,
    loading,
  }) => (
    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
      <Typography variant="h6" mb={2}>
        Profile Picture
      </Typography>
      <Avatar src={avatarPreview} sx={{ width: 120, height: 120, mb: 2 }} />
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
            onClick={onResetAvatar}
            disabled={loading}
            size="small"
          >
            Reset to Default
          </Button>
        )}
        {avatarPreview && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onRemoveAvatar}
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
        onChange={onAvatarChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </Box>
  )
);

export default AvatarEditor;
