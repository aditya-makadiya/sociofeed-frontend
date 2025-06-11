import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFollowersFollowing from './useFollowersFollowing';

const useProfileModals = (userId) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { data, loading, error, pagination, fetchFollowers, fetchFollowing, clearData } = useFollowersFollowing(5);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    clearData();
    if (type === 'followers') {
      fetchFollowers(userId, 1, 5);
    } else if (type === 'following') {
      fetchFollowing(userId, 1, 5);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    clearData();
  };

  const handlePageChange = (event, newPage) => {
    if (modalType === 'followers') {
      fetchFollowers(userId, newPage, 5);
    } else if (modalType === 'following') {
      fetchFollowing(userId, newPage, 5);
    }
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
    closeModal();
  };

  const handleRetry = () => {
    if (modalType === 'followers') {
      fetchFollowers(userId, pagination.currentPage, 5);
    } else {
      fetchFollowing(userId, pagination.currentPage, 5);
    }
  };

  const handleRefetchList = () => {
    handleRetry();
  };

  return {
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
  };
};

export default useProfileModals;