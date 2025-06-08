import React, { useEffect } from "react";
import PostCard from "../../components/post/PostCard";
import useSavedPosts from "../../hooks/useSavedPosts";
import PostCardSkeleton from "../../components/skeletons/PostCardSkeleton";
import { useInView } from "react-intersection-observer";
import { Typography } from "@mui/material";

const SavedPostsPage = () => {
  const { posts, loading, loadMorePosts, hasMore } = useSavedPosts();
  const { ref, inView } = useInView({
    threshold: 0, // Trigger when the element is in view
    skip: !hasMore || loading, // Skip observer if no more posts or loading
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, loadMorePosts]);

  return (
    <div>
      {loading && posts.length === 0 && <PostCardSkeleton count={3} />}
      {posts.length === 0 && !loading && (
        <Typography variant="body2" className="text-center text-gray-500 my-4">
          You haven't saved any posts yet.
        </Typography>
      )}
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <PostCard post={post} />
        </div>
      ))}
      {hasMore && !loading && (
        <div ref={ref}>
          <PostCardSkeleton count={1} />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <Typography variant="body2" className="text-center text-gray-500 my-4">
          No more saved posts to load.
        </Typography>
      )}
    </div>
  );
};

export default SavedPostsPage;
