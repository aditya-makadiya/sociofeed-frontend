import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from './useAuth';
import useProfile from './useProfile';

const useProfilePageData = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    profile,
    posts,
    loading: profileLoading,
    postsLoading,
    error: profileError,
    getUserProfile,
    getUserPosts,
  } = useProfile();

  useEffect(() => {
    const profileId = id || user?.id;
    if (profileId) {
      Promise.all([
        getUserProfile(profileId),
        getUserPosts(profileId, 1, 10),
      ]).catch((error) => {
        console.error('Error fetching profile data:', error);
      });
    }
  }, [id, user?.id, getUserProfile, getUserPosts]);

  return {
    profile,
    posts,
    profileLoading,
    postsLoading,
    profileError,
    isOwnProfile: user?.id === (id || user?.id),
    retry: () => {
      const profileId = id || user?.id;
      Promise.all([
        getUserProfile(profileId),
        getUserPosts(profileId, 1, 10),
      ]).catch((error) => console.error('Error fetching profile data:', error));
    },
  };
};

export default useProfilePageData;