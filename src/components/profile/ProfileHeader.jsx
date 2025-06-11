import React, { useState } from "react";
import useProfile from "../../hooks/useProfile";
import useProfileModals from "../../hooks/useProfileModals";
import ProfileAvatar from "./ProfileAvatar";
import ProfileStats from "./ProfileState";
import ProfileBio from "./ProfileBio";
import ProfileActions from "./ProfileActions";
import UserListModal from "../common/UserListModel";
import EditProfileModal from "./EditProfileModal";

const ProfileHeader = ({ user, isOwnProfile }) => {
  const {
    id,
    username,
    bio,
    avatar,
    followerCount,
    followingCount,
    isFollowing,
  } = user;
  const { followUser, unfollowUser, followLoading, getUserProfile } =
    useProfile();
  const {
    modalOpen,
    modalType,
    data,
    loading,
    error,
    pagination,
    openModal,
    closeModal,
    handlePageChange,
    handleProfileClick,
    handleRetry,
    handleRefetchList,
  } = useProfileModals(id);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-row items-start gap-4 sm:gap-6 w-full">
      <ProfileAvatar avatar={avatar} username={username} />
      <div className="flex-1 text-left min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {username}
        </h2>
        <ProfileStats
          followerCount={followerCount}
          followingCount={followingCount}
          onOpenFollowers={() => openModal("followers")}
          onOpenFollowing={() => openModal("following")}
        />
        <ProfileBio bio={bio} />
        <ProfileActions
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollow={() => followUser(id, true)}
          onUnfollow={() => unfollowUser(id, true)}
          onEditProfile={() => setEditModalOpen(true)}
        />
      </div>
      <UserListModal
        open={modalOpen}
        onClose={closeModal}
        title={modalType === "followers" ? "Followers" : "Following"}
        users={data}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onUserClick={handleProfileClick}
        onRetry={handleRetry}
        onRefetch={handleRefetchList}
      />
      {isOwnProfile && (
        <EditProfileModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={user}
          onProfileUpdate={() => getUserProfile(id)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
