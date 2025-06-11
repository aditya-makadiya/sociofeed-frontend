import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile, updateAvatar } from '../app/slices/profileSlice';

const useEditProfileForm = (user, onProfileUpdate, onClose) => {
  const dispatch = useDispatch();
  const [bio, setBio] = useState(user?.bio || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await dispatch(updateProfile({ userId: user.id, data: { username, bio } }));
      if (updateProfile.fulfilled.match(result)) {
        let updatedUser = result.payload;
        if (avatar) {
          const avatarResult = await dispatch(updateAvatar({ userId: user.id, file: avatar }));
          if (updateAvatar.fulfilled.match(avatarResult)) {
            updatedUser = avatarResult.payload;
          }
        }
        setSuccess('Profile updated successfully!');
        onProfileUpdate(updatedUser);
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBio(user?.bio || '');
    setUsername(user?.username || '');
    setAvatar(null);
    setAvatarPreview(user?.avatar || '');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    bio,
    setBio,
    username,
    setUsername,
    avatar,
    setAvatar,
    avatarPreview,
    setAvatarPreview,
    loading,
    error,
    success,
    fileInputRef,
    handleSubmit,
    resetForm,
  };
};

export default useEditProfileForm;