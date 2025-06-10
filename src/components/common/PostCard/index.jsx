// components/PostCard/index.js
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import usePost from "../../../hooks/usePost";
import usePostActions from "../../../hooks/usePostActions";
import { showErrorToast } from "../../notifications/toastUtils";
import PostHeader from "./PostHeader";
import PostImageCarousel from "./PostImageCarousel";
import PostContent from "./PostContent";
import PostActions from "./PostActions";

const PostCard = ({ post, onPostUpdate }) => {
  const {
    id,
    content = "",
    images = [],
    likeCount: initLike = 0,
    commentCount: initComment = 0,
    isLiked: initLiked = false,
    isSaved: initSaved = false,
    user,
    createdAt,
  } = post;

  const [localState, setLocalState] = useState({
    isLiked: initLiked,
    isSaved: initSaved,
    likeCount: Number(initLike),
    commentCount: Number(initComment),
  });

  const { handleAddComment, commentLoading } = usePost();
  const { handleToggleLike, handleToggleSave, likeLoading, saveLoading } =
    usePostActions();

  useEffect(() => {
    setLocalState({
      isLiked: initLiked,
      isSaved: initSaved,
      likeCount: Number(initLike),
      commentCount: Number(initComment),
    });
  }, [initLiked, initSaved, initLike, initComment]);

  const handleLikeToggle = async () => {
    const { isLiked, likeCount } = localState;
    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : Math.max(likeCount - 1, 0);

    setLocalState((prev) => ({
      ...prev,
      isLiked: newLiked,
      likeCount: newCount,
    }));

    try {
      const updatedLikeCount = await handleToggleLike(id, isLiked);
      if (updatedLikeCount !== null) {
        setLocalState((prev) => ({
          ...prev,
          isLiked: newLiked,
          likeCount: updatedLikeCount,
        }));
        onPostUpdate?.(id, {
          isLiked: newLiked,
          likeCount: updatedLikeCount,
        });
      } else {
        setLocalState((prev) => ({ ...prev, isLiked, likeCount }));
      }
    } catch (err) {
      console.log(err);

      setLocalState((prev) => ({ ...prev, isLiked, likeCount }));
      showErrorToast("Like update failed");
    }
  };

  const handleSaveToggle = async () => {
    const { isSaved } = localState;
    const newSaved = !isSaved;

    setLocalState((prev) => ({ ...prev, isSaved: newSaved }));

    try {
      const result = await handleToggleSave(id, isSaved);
      if (result) {
        onPostUpdate?.(id, { isSaved: newSaved });
      } else {
        setLocalState((prev) => ({ ...prev, isSaved }));
      }
    } catch (err) {
      console.log(err);

      setLocalState((prev) => ({ ...prev, isSaved }));
      showErrorToast("Save update failed");
    }
  };

  const handleCommentSubmit = async (commentText) => {
    const res = await handleAddComment(id, commentText);
    if (res) {
      setLocalState((prev) => ({
        ...prev,
        commentCount: Number(res.commentCount),
      }));
      onPostUpdate?.(id, { commentCount: res.commentCount });
    }
  };

  return (
    <Box
      component="article"
      className="bg-white rounded-lg shadow-md mb-6 transition hover:shadow-lg"
    >
      <PostHeader user={user} createdAt={createdAt} />

      <PostImageCarousel images={images} />

      <PostContent content={content} />

      <PostActions
        postId={id}
        localState={localState}
        onLikeToggle={handleLikeToggle}
        onSaveToggle={handleSaveToggle}
        onCommentSubmit={handleCommentSubmit}
        likeLoading={likeLoading}
        saveLoading={saveLoading}
        commentLoading={commentLoading}
      />
    </Box>
  );
};

export default PostCard;
