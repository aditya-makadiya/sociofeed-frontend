import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedPosts, resetPosts } from "../app/slices/postSlice";

const useSavedPosts = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore, currentPage, error, total } = useSelector(
    (state) => state.post,
  );

  // Reset posts on mount to clear any existing feed posts
  useEffect(() => {
    dispatch(resetPosts());
    dispatch(fetchSavedPosts(1));
    return () => {
      dispatch(resetPosts()); // Cleanup on unmount
    };
  }, [dispatch]);

  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchSavedPosts(currentPage + 1));
    }
  }, [dispatch, loading, hasMore, currentPage]);

  return {
    posts,
    loading,
    hasMore,
    loadMorePosts,
    error,
    total,
  };
};

export default useSavedPosts;
