// hooks/useFeed.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedPosts } from "../app/slices/postSlice";

export const useFeed = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((state) => state.post);
  const page = useSelector((state) => state.post.currentPage);

  useEffect(() => {
    if (hasMore) {
      dispatch(fetchFeedPosts(page));
    }
  }, [dispatch, page, hasMore]);

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      // Check if there are more posts and not currently loading
      return dispatch(fetchFeedPosts(page + 1));
    }
  };

  return { posts, loading, loadMorePosts, hasMore };
};
