// components/profile/FollowingList.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

const FollowingList = ({ profiles, handleCloseModal }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  {
    handleCloseModal;
  }
  // Get current page items
  const startIndex = (page - 1) * itemsPerPage;
  const currentProfiles = profiles.slice(startIndex, startIndex + itemsPerPage);

  // Handle pagination
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div>
      {profiles.length === 0 ? (
        <p className="text-sm text-gray-600">Not following anyone yet.</p>
      ) : (
        <>
          <ul className="space-y-3 mb-4">
            {currentProfiles.map((profile) => (
              <li key={profile.id} className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <PersonIcon
                    sx={{ fontSize: { xs: 16, sm: 20 }, color: "#4b5563" }}
                  />
                </div>
                <span className="text-sm sm:text-base text-gray-900 truncate">
                  {profile.username}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <Button
              variant="outlined"
              size="small"
              onClick={handlePreviousPage}
              disabled={page === 1}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outlined"
              size="small"
              onClick={handleNextPage}
              disabled={page === totalPages}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FollowingList;
