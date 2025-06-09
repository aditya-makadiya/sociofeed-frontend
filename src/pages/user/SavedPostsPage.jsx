import React, { useEffect, useState } from "react";
import PostCard from "../../components/common/PostCard";
import useSavedPosts from "../../hooks/useSavedPosts";
import PostCardSkeleton from "../../components/skeletons/PostCardSkeleton";
import { useInView } from "react-intersection-observer";
import { Typography } from "@mui/material";

const SavedPostsPage = () => {
  const {
    posts: initialPosts,
    loading,
    loadMorePosts,
    hasMore,
  } = useSavedPosts();
  const [posts, setPosts] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0,
    skip: !hasMore || loading,
  });

  // Sync local posts with hook posts, ensuring isSaved: true
  useEffect(() => {
    setPosts(initialPosts.map((post) => ({ ...post, isSaved: true })));
  }, [initialPosts]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, loadMorePosts]);

  // Handle post updates (e.g., unsave)
  const handlePostUpdate = (postId, updatedData) => {
    if (updatedData.isSaved === false) {
      // Remove unsaved post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } else {
      // Update post's isSaved status
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isSaved: updatedData.isSaved } : post,
        ),
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6">
      {loading && posts.length === 0 && <PostCardSkeleton count={3} />}
      {posts.length === 0 && !loading && (
        <Typography variant="body2" className="text-center text-gray-500 my-4">
          You haven't saved any posts yet.
        </Typography>
      )}
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <PostCard post={post} onPostUpdate={handlePostUpdate} />
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
