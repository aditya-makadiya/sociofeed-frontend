// hooks/useFollowersFollowing.js
import { useState, useCallback } from "react";
import apiClient from "../utils/apiClient";
import { showErrorToast } from "../components/notifications/toastUtils";

const useFollowersFollowing = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 5,
  });

  const fetchFollowers = useCallback(async (userId, page = 1, pageSize = 5) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`/users/${userId}/followers`, {
        params: { page, pageSize },
      });

      // console.log("Full followers response:", response);
      // console.log("Followers response data:", response.data);

      let responseData;

      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        responseData = response.data.data;
      } else if (response.data && response.data.users) {
        responseData = response.data;
      } else if (Array.isArray(response.data)) {
        responseData = {
          users: response.data,
          total: response.data.length,
          page: page,
          pageSize: pageSize,
        };
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Unexpected response structure");
      }

      setData(responseData.users || []);
      setPagination({
        currentPage: responseData.page || page,
        totalPages: Math.ceil((responseData.total || 0) / pageSize),
        totalCount: responseData.total || 0,
        pageSize: responseData.pageSize || pageSize,
      });
      return responseData;
    } catch (err) {
      console.error("Error fetching followers:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch followers";
      setError(errorMessage);
      showErrorToast(errorMessage);
      setData([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFollowing = useCallback(
    async (userId, page = 1, pageSize = 10) => {
      try {
        setLoading(true);
        setError(null);

        // console.log(
        //   "Fetching following for userId:",
        //   userId,
        //   "page:",
        //   page,
        //   "pageSize:",
        //   pageSize,
        // );

        const response = await apiClient.get(`/users/${userId}/following`, {
          params: { page, pageSize },
        });


        let responseData;

        if (
          response.data &&
          response.data.status === "success" &&
          response.data.data
        ) {
          responseData = response.data.data;
        } else if (response.data && response.data.users) {
          responseData = response.data;
        } else if (Array.isArray(response.data)) {
          responseData = {
            users: response.data,
            total: response.data.length,
            page: page,
            pageSize: pageSize,
          };
        } else {
          console.error("Unexpected response structure:", response.data);
          throw new Error("Unexpected response structure");
        }


        setData(responseData.users || []);
        setPagination({
          currentPage: responseData.page || page,
          totalPages: Math.ceil((responseData.total || 0) / pageSize),
          totalCount: responseData.total || 0,
          pageSize: responseData.pageSize || pageSize,
        });
        return responseData;
      } catch (err) {
        console.error("Error fetching following:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch following";
        setError(errorMessage);
        showErrorToast(errorMessage);
        setData([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: 10,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      pageSize: 10,
    });
  }, []);

  const updateUserFollowingStatus = useCallback((userId, isFollowing) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user,
      ),
    );
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    fetchFollowers,
    fetchFollowing,
    clearData,
    updateUserFollowingStatus, 
  };
};

export default useFollowersFollowing;
