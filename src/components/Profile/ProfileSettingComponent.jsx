import React, { useState } from 'react';
import './ProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import bgImage from '../../assets/images/breadcrumBg.avif';
import {updateProfileSettings} from "../../features/user/userSlice";
import favicon from '../../assets/images/MPF-180x180.png';


const ProfilePage = () => {


  const dispatch = useDispatch();

  const {
    loading,
    data
  } = useSelector((state) => state.user);



  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...data,
    profile_img: data.profile_img_url || null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEditedUser(prev => ({
        ...prev,
        profile_img: file
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      // Add all the form fields to FormData
      if (editedUser.name) formData.append('name', editedUser.name);
      if (editedUser.address) formData.append('address', editedUser.address);
      if (editedUser.email) formData.append('email', editedUser.email);
      
      // Handle profile image if it's a file
      if (editedUser.profile_img && editedUser.profile_img instanceof File) {
        formData.append('profile_img', editedUser.profile_img);
      } else if (typeof editedUser.profile_img === 'string') {
        // If it's a string (URL), it means the image wasn't changed
        // formData.append('profile_img', editedUser.profile_img);
      }

      // Dispatch the update action with formData
      const resultAction = await dispatch(updateProfileSettings(formData));
      
      // If the update was successful, update the local state
      if (resultAction) {
        setUser(editedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  const handleCancel = () => {
    setEditedUser(data);
    setIsEditing(false);
  };

  return (
    <div className="profile-container container p-0 mb-4">
      <div className="profile-header ">
        <div
          className="cover-image breadcrum-bg-image"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar-upload">
              <label htmlFor="profile-upload">
                <img 
                  src={imagePreview || data.profile_img_url || favicon} 
                  alt="Profile" 
                  className="avatarProfile" 
                />
                {isEditing && (
                  <div className="upload-overlay">
                    <i className="fas fa-camera"></i>
                  </div>
                )}
              </label>
              {isEditing && (
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              )}
            </div>
            {isEditing ? "" : (
            <button
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            )}
          </div>

          <div className="user-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="form-control"
                />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={editedUser.address || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="edit-actions">
                  <button className="btn btn-primary" disabled={loading} onClick={handleSave}>{loading ? "Saving" : "Save"}</button>
                  <button className="btn btn-secondary" disabled={loading} onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="user-name">{data.name}</h1>
                <div className="user-meta">
                  <span className="location">📍 {data?.address}</span>
                  <span className="join-date">Joined {data?.created_at}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;