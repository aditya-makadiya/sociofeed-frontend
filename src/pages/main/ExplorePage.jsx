import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import CustomPagination from "../../components/common/CustomPagination";
import useProfile from "../../hooks/useProfile";
import { showErrorToast } from "../../components/notifications/toastUtils";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { users, usersTotal, searchLoading, searchUsers, clearUsers } =
    useProfile();
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        try {
          await searchUsers(query, page, pageSize); // This now calls handleSearchUsers
        } catch (error) {
          console.log(error);

          showErrorToast("Failed to search users");
        }
      } else {
        clearUsers();
      }
    }, 500), // 500ms debounce delay
    [searchUsers, clearUsers],
  );

  // Handle search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cleanup debounce on unmount
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  // Handle page changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (searchQuery.trim()) {
      searchUsers(searchQuery, newPage, pageSize);
    }
  };

  // Navigate to user profile
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Calculate total pages
  const totalPages = Math.ceil(usersTotal / pageSize);

  return (
    <Box className="min-h-screen bg-gray-100 p-4">
      <Box className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <Box className="bg-white shadow-md rounded-lg p-4 mb-6">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
        </Box>

        {/* Users List */}
        <Box className="bg-white shadow-md rounded-lg p-4">
          {searchLoading && (
            <Box className="flex justify-center py-4">
              <CircularProgress />
            </Box>
          )}
          {!searchLoading && searchQuery.trim() && users.length === 0 && (
            <Typography className="text-gray-500 text-center">
              No users found.
            </Typography>
          )}
          {!searchLoading && users.length > 0 && (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Box
                  key={user.id}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <Box>
                    <Typography variant="h6" className="font-bold">
                      {user.username}
                    </Typography>
                    {user.bio && (
                      <Typography variant="body2" className="text-gray-600">
                        {user.bio}
                      </Typography>
                    )}
                    <Typography variant="body2" className="text-gray-500">
                      {user.followerCount} followers • {user.followingCount}{" "}
                      following
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {users.length > 0 && (
          <Box className="mt-6">
            <CustomPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={usersTotal}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExplorePage;
