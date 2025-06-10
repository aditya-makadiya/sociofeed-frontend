// components/PostCard/PostImageCarousel.js
import React, { useState, useEffect } from "react";
import { Box, IconButton as MuiIconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const PostImageCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <Box className="w-full relative">
      <Box
        className="w-full"
        sx={{
          aspectRatio: "16/9",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Post image ${currentImageIndex + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
          loading="lazy"
        />
      </Box>

      {images.length > 1 && (
        <>
          <MuiIconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </MuiIconButton>

          <MuiIconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </MuiIconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.75rem",
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PostImageCarousel;
