import { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resetAvatar } from '../app/slices/profileSlice';

const useAvatarCropper = (user, setAvatar, setAvatarPreview) => {
  const dispatch = useDispatch();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return { error: 'Please select a valid image file' };
      }
      if (file.size > 5 * 1024 * 1024) {
        return { error: 'Image size should be less than 5MB' };
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      return { error: '' };
    }
    return { error: '' };
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], 'cropped-avatar.jpg', { type: 'image/jpeg' });
            resolve(file);
          },
          'image/jpeg',
          0.9
        );
      };
    });
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      const croppedFile = await createCroppedImage(imageToCrop, croppedAreaPixels);
      setAvatar(croppedFile);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(croppedFile);
      setCropModalOpen(false);
      setImageToCrop(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.log(err);
      
      return { error: 'Failed to crop image' };
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(user?.avatar || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetToDefault = async () => {
    try {
      const result = await dispatch(resetAvatar(user.id));
      if (resetAvatar.fulfilled.match(result)) {
        setAvatarPreview(result.payload.avatar);
        setAvatar(null);
        return { success: 'Avatar reset to default successfully', updatedUser: result.payload };
      }
      return { error: 'Failed to reset avatar' };
    } catch (err) {
      return { error: err.message || 'Failed to reset avatar' };
    }
  };

  return {
    cropModalOpen,
    setCropModalOpen,
    imageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    croppedAreaPixels,
    onCropComplete,
    fileInputRef,
    handleAvatarChange,
    handleCropSave,
    handleCropCancel,
    handleRemoveAvatar,
    handleResetToDefault,
  };
};

export default useAvatarCropper;