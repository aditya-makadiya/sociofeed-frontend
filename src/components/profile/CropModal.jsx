import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Cropper from "react-easy-crop";

const CropModal = ({
  cropModalOpen,
  handleCropCancel,
  imageToCrop,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  handleCropSave,
}) => {
  return (
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
  );
};

export default CropModal;
