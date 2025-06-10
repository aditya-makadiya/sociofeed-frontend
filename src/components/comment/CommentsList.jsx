import React from "react";
import CommentItem from "./CommentItem";
import { styled } from "@mui/material";

const StyledDiv = styled("div")({});

const CommentsList = ({
  comments,
  currentUserId,
  onUpdateComment,
  onDeleteComment,
  postId,
}) => {
  return (
    <StyledDiv>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          postId={postId}
        />
      ))}
    </StyledDiv>
  );
};

export default CommentsList;
