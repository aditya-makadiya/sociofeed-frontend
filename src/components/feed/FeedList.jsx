// components/feed/FeedList.jsx
import React, { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import { useFeed } from "../../hooks/useFeed";
import PostCardSkeleton from "../skeletons/PostCardSkeleton";

const FeedList = () => {
  const { posts, loading, loadMorePosts, hasMore } = useFeed();
  const [loadingMore, setLoadingMore] = useState(false);

  const handleScroll = () => {
    // Check if the user has scrolled to the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && // Adjust threshold as needed
      hasMore && // Check if there are more posts to load
      !loadingMore && // Prevent multiple calls
      !loading // Ensure not currently loading
    ) {
      setLoadingMore(true);
      loadMorePosts().finally(() => setLoadingMore(false));
    }
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadingMore, hasMore, loading]); // Dependencies to re-run effect

  return (
    <div>
      {loading && <PostCardSkeleton count={3} />}
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <PostCard post={post} />
        </div>
      ))}
      {loadingMore && <PostCardSkeleton count={1} />}
    </div>
  );
};

export default FeedList;
