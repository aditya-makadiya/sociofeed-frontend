import React, { memo } from "react";
import { Button, Box, CircularProgress } from "@mui/material";

const FormActions = memo(({ loading, onCancel, onSubmit }) => (
  <Box display="flex" gap={2} justifyContent="flex-end">
    <Button variant="outlined" onClick={onCancel} disabled={loading}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={onSubmit}
      disabled={loading}
      startIcon={loading && <CircularProgress size={20} />}
    >
      {loading ? "Saving..." : "Save Changes"}
    </Button>
  </Box>
));

export default FormActions;
