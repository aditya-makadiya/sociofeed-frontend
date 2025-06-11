import React from "react";
import { TextField, Box } from "@mui/material";

const ProfileForm = React.memo(
  ({ username, bio, onUsernameChange, onBioChange, loading }) => (
    <>
      <Box mb={3}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
          disabled={loading}
          inputProps={{ maxLength: 50 }}
          helperText={`${username.length}/50 characters`}
        />
      </Box>
      <Box mb={3}>
        <TextField
          fullWidth
          label="Bio"
          multiline
          rows={4}
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Tell us about yourself..."
          disabled={loading}
          inputProps={{ maxLength: 500 }}
          helperText={`${bio.length}/500 characters`}
        />
      </Box>
    </>
  )
);

export default ProfileForm;
