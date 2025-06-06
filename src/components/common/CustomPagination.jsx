// components/common/CustomPagination.jsx
import React from "react";
import { Pagination, Box, Typography } from "@mui/material";

const CustomPagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  showInfo = true,
  size = "medium",
  color = "primary",
  showFirstButton = true,
  showLastButton = true,
  className = "",
  ...props
}) => {
  // Calculate the range of items being displayed
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no data
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      className={className}
      {...props}
    >
      {showInfo && totalCount > 0 && (
        <Typography variant="body2" color="textSecondary">
          Showing {startItem}-{endItem} of {totalCount} items
        </Typography>
      )}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color={color}
        size={size}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default CustomPagination;
