import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CustomPagination from "../../components/common/CustomPagination";
import useProfile from "../../hooks/useProfile";
import useAuth from "../../hooks/useAuth";
import { showErrorToast } from "../../components/notifications/toastUtils";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [localUsers, setLocalUsers] = useState([]); // Local state for optimistic updates
  const pageSize = 10;
  const lastSearchedQueryRef = useRef("");
  const renderCountRef = useRef(0);

  const {
    users,
    usersTotal,
    searchLoading,
    searchUsers,
    clearUsers,
    followUser,
    unfollowUser,
    followLoading,
  } = useProfile();
  const { getUser, user: authUser } = useAuth();
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user.id || "");

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);


  useEffect(() => {
    if (!currentUserId && authUser === undefined) {
      // console.log("Fetching current user...");
      getUser().catch((err) => {
        console.error("Failed to fetch current user:", err);
      });
    }
  }, [currentUserId, authUser, getUser]);

  renderCountRef.current += 1;
  // console.log(`ExplorePage render count: ${renderCountRef.current}`);
  useEffect(() => {
    // console.log("Current User ID:", {
    //   value: currentUserId,
    //   type: typeof currentUserId,
    // });
    // console.log("Users:", localUsers);
    const filteredUsers = localUsers.filter(
      (u) => String(u.id) !== String(currentUserId),
    );
    // console.log("Filtered Users:", filteredUsers);
    if (
      currentUserId &&
      localUsers.some((u) => String(u.id) === String(currentUserId))
    ) {
      console.warn("Logged-in user found in users list:", {
        userId: currentUserId,
        users: localUsers,
      });
    }
  }, [currentUserId, localUsers]);

  const debouncedSearch = useCallback(
    debounce((query, pageNum) => {
      // console.log("Executing debounced search:", { query, page: pageNum });
      searchUsers(query, pageNum, pageSize).catch((error) => {
        console.error("Search error:", error);
        showErrorToast("Failed to search users");
      });
    }, 500),
    [searchUsers, clearUsers],
  );

  useEffect(() => {
    // console.log("debouncedSearch created");
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchQuery.trim() !== lastSearchedQueryRef.current) {
      // console.log("Search query changed:", searchQuery);
      if (searchQuery.trim()) {
        lastSearchedQueryRef.current = searchQuery.trim();
        debouncedSearch(searchQuery, 1);
      } else {
        // console.log("Clearing users due to empty query");
        lastSearchedQueryRef.current = "";
        clearUsers();
      }
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch, clearUsers]);

  useEffect(() => {
    if (
      page !== 1 &&
      searchQuery.trim() &&
      searchQuery.trim() === lastSearchedQueryRef.current
    ) {
      // console.log("Fetching page:", page, "for query:", searchQuery);
      searchUsers(searchQuery, page, pageSize).catch((error) => {
        console.error("Pagination search error:", error);
        showErrorToast("Failed to fetch users");
      });
    }
  }, [page, searchQuery, searchUsers]);

  const handlePageChange = (e, newPage) => {
    // console.log("Changing to page:", newPage);
    setPage(newPage);
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    const originalUsers = [...localUsers];
    const newIsFollowing = !isFollowing;

    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: newIsFollowing } : u,
      ),
    );

    try {
      // console.log(
      //   `Attempting to ${isFollowing ? "unfollow" : "follow"} user:`,
      //   userId,
      // );
      if (isFollowing) {
        await unfollowUser(userId);
        // console.log(`Unfollowed user ${userId}`);
      } else {
        await followUser(userId);
        // console.log(`Followed user ${userId}`);
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      showErrorToast(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
      setLocalUsers(originalUsers);
      if (searchQuery.trim()) {
        searchUsers(searchQuery, page, pageSize).catch((error) => {
          console.error("Refetch error:", error);
        });
      }
    }
  };

  const handleUserClick = (userId) => {
    // console.log("Navigating to profile:", userId);
    navigate(`/profile/${userId}`);
  };

  const filteredUsers = localUsers.filter(
    (u) => String(u.id) !== String(currentUserId),
  );
  const totalPages = Math.ceil(usersTotal / pageSize);

  if (currentUserId === undefined) {
    // console.log("Waiting for auth data...");
    return (
      <Box className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100 p-4">
      <Box className="max-w-7xl mx-auto">
        <Box className="bg-white shadow-md rounded-lg p-4 mb-6">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
            className="mb-4"
          />
        </Box>

        <Box className="bg-white shadow-md rounded-lg p-4">
          {searchLoading && (
            <Box className="flex justify-center py-4">
              <CircularProgress />
            </Box>
          )}

          {!searchLoading &&
            searchQuery.trim() &&
            filteredUsers.length === 0 && (
              <Typography className="text-gray-500 text-center">
                No users found.
              </Typography>
            )}

          {!searchLoading && filteredUsers.length > 0 && (
            <Box className="grid grid-cols-1 gap-4">
              {filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <Box
                    className="flex items-center cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Box className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.username} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Box className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <PersonIcon sx={{ fontSize: 24, color: "#4b5563" }} />
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h6" className="font-bold">
                        {user.username}
                      </Typography>
                      {user.bio && (
                        <Typography
                          variant="body2"
                          className="text-gray-600 line-clamp-1"
                        >
                          {user.bio}
                        </Typography>
                      )}
                      <Typography variant="body2" className="text-gray-500">
                        {user.followerCount} followers • {user.followingCount}{" "}
                        following
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant={user.isFollowing ? "outlined" : "contained"}
                    color="primary"
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                    onClick={() =>
                      handleFollowToggle(user.id, user.isFollowing)
                    }
                    disabled={followLoading}
                  >
                    {followLoading
                      ? "Loading..."
                      : user.isFollowing
                        ? "Unfollow"
                        : "Follow"}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {filteredUsers.length > 0 && (
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
