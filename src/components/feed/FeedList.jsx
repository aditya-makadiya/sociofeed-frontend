import React, { useEffect } from "react";
import PostCard from "../common/PostCard";
import { useFeed } from "../../hooks/useFeed";
import PostCardSkeleton from "../skeletons/PostCardSkeleton";
import { useInView } from "react-intersection-observer";
import { Typography } from "@mui/material";

const FeedList = () => {
  const { posts, loading, loadMorePosts, hasMore } = useFeed();
  const { ref, inView } = useInView({
    threshold: 0,
    skip: !hasMore || loading,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, loadMorePosts]);

  return (
    <div>
      {loading && posts.length === 0 && <PostCardSkeleton count={3} />}
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
          You're all caught up!
        </Typography>
      )}
    </div>
  );
};

export default FeedList;
