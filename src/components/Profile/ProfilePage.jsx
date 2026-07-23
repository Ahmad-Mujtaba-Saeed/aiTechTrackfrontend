// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileSettings } from '../../features/user/userSlice';
import favicon from '../../assets/demo_profile.avif';
import axios, { stripe_public_key } from '../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { updateCurrentPassword } from '../../features/user/userSlice';
import Swal from 'sweetalert2';
import Alert from "react-bootstrap/Alert";

const stripePromise = loadStripe(stripe_public_key);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('subscription');
  const [imagePreview, setImagePreview] = useState(null);
  const [credit, setCredit] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const settings = urlParams.get('settings');
    if (settings === 'true') {
      setActiveTab('settings');
    }
  }, []);

  useEffect(() => {
    axios.get('billing/customer/credit').then(res => {
      setCredit(res.data.credit);
    });
  }, []);
  const [editedUser, setEditedUser] = useState({
    firstName: 'Johnathan',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    birthDate: '1990-01-15',
    bio: "I'm a passionate software developer with over 10 years of experience in web technologies. I love creating user-friendly applications that solve real-world problems."
  });
  const [settings, setSettings] = useState({
    lang: 'en',
    time_zone: 'UTC',
    email_notif: true,
    push_notif: true
  });

  // Load user settings when component mounts
  useEffect(() => {
    if (userData) {
      setSettings({
        lang: userData.lang || 'en',
        time_zone: userData.time_zone || 'UTC',
        email_notif: userData.email_notif !== undefined ? userData.email_notif : true,
        push_notif: userData.push_notif !== undefined ? userData.push_notif : true
      });
    }
  }, [userData]);

  // Save settings to backend
  const saveSettings = async (newSettings, e) => {
    if (e) e.preventDefault();
    try {
      await axios.post('/user/profile-settings', newSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      // Revert the state on error
      setSettings(prev => ({ ...prev }));
    }
  };

  // Handle settings change
  const handleSettingsChange = (name, value) => {
    const newSettings = {
      ...settings,
      [name]: value
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };


  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Subscription state
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethodToRemove, setPaymentMethodToRemove] = useState(null);
useEffect(() => {
  console.log("activeTab changed:", activeTab);

  if (activeTab === "subscription") {
    console.log("Fetching subscription...");
    fetchSubscriptionDetails();
    fetchPaymentMethods();
  }
}, [activeTab]);

  // Subscription functions
const fetchSubscriptionDetails = async () => {
  try {
    setLoading(true);

    const response = await axios.get('/billing/subscription/details');

    console.log("API Response:", response.data);

    const { subscription } = response.data;

    console.log("Subscription:", subscription);

    if (subscription) {
      setSubscription({
        id: subscription.id,
        planName: subscription.plan?.title || subscription.name,
        amount: `£${subscription.plan?.price || '0.00'}`,
        interval: subscription.plan?.interval || 'monthly',
        status: subscription.status,
        nextBillingDate: subscription.ends_at,
        features: subscription.plan?.features || [],
        subId: subscription.sub_id,
        cus_id: subscription.cus_id,
      });
    } else {
        console.log("Subscription is null");
    }
  } catch (err) {
    console.error(err.response?.data);
  } finally {
    setLoading(false);
  }
};

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/billing/subscription/payment-method');
      const paymentMethods = response.data.data.map(method => ({
        id: method.id,
        type: method.type,
        default: method.default,
        card: {
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year,
          country: method.card.country
        },
        billing: {
          name: method.billing_details.name,
          email: method.billing_details.email,
          country: method.billing_details.address?.country
        },
        created: new Date(method.created * 1000).toISOString()
      }));
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const handleRemovePaymentMethod = async () => {
    if (!paymentMethodToRemove) return;

    try {
      setLoading(true);
      await axios.delete(`/billing/subscription/payment-method/${paymentMethodToRemove}`);
      await fetchPaymentMethods();
      toast.success('Payment method removed successfully');
      setPaymentMethodToRemove(null);
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast.error('Failed to remove payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      const customerId = subscription?.cus_id;
      if (!customerId) {
        throw new Error('Customer ID not found');
      }

      const response = await axios.get(`/billing/subscription/payment-method-intent/${customerId}`);
      setClientSecret(response.data.clientSecret);
      setShowAddPaymentModal(true);
    } catch (error) {
      console.error('Error setting up payment method:', error);
      toast.error('Failed to set up payment method');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userData?.name || '',
            email: userData?.email || ''
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Payment method added successfully');
      setShowAddPaymentModal(false);
      await axios.post(`/billing/subscription/payment-method-default/${subscription?.cus_id}`, {
        payment_method_id: setupIntent.payment_method
      });
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error(error.message || 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await axios.post('/billing/subscription/cancel');
      setShowCancelModal(false);
      await fetchSubscriptionDetails();
      toast.success('Subscription has been cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeDefault = async (paymentMethodId) => {
    try {
      setLoading(true);
      await axios.post(`/billing/subscription/payment-method-default/${subscription?.cus_id}`, {
        payment_method_id: paymentMethodId
      });
      toast.success('Payment method updated successfully');
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Profile functions
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!validateForm(type)) return;

    setIsLoading(true);
    try {
      if (type === 'profile') {
        const formData = new FormData();

        // Only append fields that have values
        if (userData.name) formData.append('name', userData.name);
        if (userData.email) formData.append('email', userData.email);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.bio) formData.append('bio', userData.bio);
        else formData.append('bio', ''); 

        // Append image if selected
        if (selectedImage) {
          formData.append('profile_img', selectedImage);
        }

        await onSave(formData, 'profile');

        if (selectedImage) {
          setSelectedImage(null);
        }
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container container p-0 my-0 mx-auto" style={{ maxWidth: 1200 }}>
      {/* Profile Header */}
      <ProfileHeader userData={userData} imagePreview={imagePreview} />

      <div className="profile-content">
        <EditProfileTab
          initialUserData={userData}
          onSave={async (formData, type) => {
            try {
              const response = await dispatch(updateProfileSettings(formData)).unwrap();
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile updated successfully',
                timer: 2000,
                showConfirmButton: false
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update profile',
                confirmButtonText: 'OK'
              });
            }
          }}
          onPasswordChange={async (passwordData) => {
            try {
              const response = await dispatch(updateCurrentPassword({
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                new_password_confirmation: passwordData.confirmPassword
              })).unwrap();


              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message || 'Password updated successfully',
                timer: 2000,
                showConfirmButton: false
              });

              // Clear the form
              return true;
            } catch (error) {
              // Handle error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update password',
                confirmButtonText: 'OK'
              });
              throw error; 
            }
          }}
        />

        <SettingsTab
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onSubmit={(e) => handleSubmit(e, 'settings')}
        />

        <SubscriptionTab
          loading={loading}
          subscription={subscription}
          paymentMethods={paymentMethods}
          onCancelSubscription={() => setShowCancelModal(true)}
          onUpgradeSubscription={() => navigate('/upgrade-subscription')}
          onAddPaymentMethod={handleAddPaymentMethod}
          onMakeDefault={handleMakeDefault}
          onRemovePaymentMethod={setPaymentMethodToRemove}
          formatDate={formatDate}
          credit={credit}
        />

      </div>

      {/* Modals */}
      <RemovePaymentModal
        show={!!paymentMethodToRemove}
        onHide={() => setPaymentMethodToRemove(null)}
        onConfirm={handleRemovePaymentMethod}
        loading={loading}
      />

      <CancelSubscriptionModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        loading={loading}
      />

      <AddPaymentModal
        show={showAddPaymentModal}
        onHide={() => setShowAddPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
        isProcessing={isProcessing}
        stripe={stripe}
      />
    </div>
  );
};


const ProfileHeader = ({ userData, imagePreview }) => (
  <div class="profile-sidebar">
    <div class="profile-avatar">
      <div class="avatar-container">
        <img src={imagePreview || userData?.profile_img_url || favicon} alt="User Avatar" class="avatar-image" />
        <div class="avatar-edit" id="editAvatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
        </div>
      </div>
      <div class="user-info">
        <h2>{userData?.name}</h2>
        <p>{userData?.email}</p>
        {userData?.email_verified_at && (
          <span class="verified-badge">
            <i class="fas fa-check-circle"></i> Verified
          </span>
        )}
      </div>
    </div>

  </div>
);


const PersonalInfoTab = ({ userData }) => (
  <div className="profile-section">
    <h3 className="section-title">Personal Information</h3>
    <div className="row">
      <div className="col-md-6">
        <InfoItem icon="👤" label="Full Name" value={userData?.name} />
        <InfoItem icon="📧" label="Email" value={userData?.email} />
        <InfoItem icon="📞" label="Phone" value={userData?.phone} />
      </div>
      <div className="col-md-6">
        <InfoItem icon="🎂" label="Date of Birth" value={userData?.dob} />
        <InfoItem icon="📍" label="Address" value={userData?.address} />
        <InfoItem icon="📅" label="Member Since" value={new Date(userData?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} />
      </div>
    </div>
  </div>
);

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    <div className="info-icon">{icon}</div>
    <div>
      <div className="info-label">{label}</div>
      <div className="info-value">{value || 'Not provided'}</div>
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = ({ settings, onSettingsChange }) => {
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  const timezones = [
    'Europe/London', // BST/GMT
    'UTC',
    'Europe/Paris', // CEST
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Dubai',
    'Asia/Karachi',
    'Asia/Dhaka',
    'Asia/Bangkok',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Pacific/Auckland',
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'America/Toronto',
    'America/Sao_Paulo',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Australia/Perth'
  ];

  const formatTimezone = (tz) => {
    const date = new Date();
    const options = { timeZone: tz, timeZoneName: 'short' };
    const timeZoneName = new Intl.DateTimeFormat('en-US', options)
      .formatToParts(date)
      .find(part => part.type === 'timeZoneName').value;

    return `${tz.replace('_', ' ')} (${timeZoneName})`;
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3>Account Settings</h3>
      </div>

      <div className="h-wrap">
        <div className="v-wrap">
          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              className="form-select mb-0"
              value={settings.lang}
              onChange={(e) => onSettingsChange('lang', e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label mb-0">Time Zone</label>
            <select
              className="form-select"
              value={settings.time_zone}
              onChange={(e) => onSettingsChange('time_zone', e.target.value)}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>
                  {formatTimezone(tz)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="v-wrap justify-content-end gap-4">
          <ToggleSetting
            label="Email Notifications"
            description="Receive updates via email"
            checked={settings.email_notif}
            onChange={(checked) => onSettingsChange('email_notif', checked)}
          />
          <ToggleSetting
            label="Push Notifications"
            description="Receive browser notifications"
            checked={settings.push_notif}
            onChange={(checked) => onSettingsChange('push_notif', checked)}
          />
        </div>
      </div>
    </div>
  );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, checked, onChange }) => (
  <div className="settings-option h-wrap align-items-center justify-content-between">
    <div>
      <div className="fw-bold">{label}</div>
      <div className="text-muted small">{description}</div>
    </div>
    <label className="toggle-switch m-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  </div>
);

// Subscription Tab Component
const SubscriptionTab = ({
  loading,
  subscription,
  paymentMethods,
  onCancelSubscription,
  onUpgradeSubscription,
  onAddPaymentMethod,
  onMakeDefault,
  onRemovePaymentMethod,
  formatDate,
  credit
}) => (
  <div className="v-wrap gap-4">
    <div className="profile-section">
      <div className="section-header">
        <h3>Currently Active Plan</h3>
      </div>



      {/* Subscription Card */}
      {credit > 0 && (
        <Alert variant="success" className="mb-4">
          You have <strong>£{credit.toFixed(2)}</strong> credit available — it will
          be automatically applied to your next invoice.
        </Alert>
      )}
      <div className="subscription-card premium">

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : subscription ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="subscription-title">{subscription.planName}</span>
                <span className={`badge-${subscription.status === 'active' ? 'premium' : 'warning'} ms-2`}>
                  {subscription.status}
                </span>
              </div>
              <div className="subscription-price">
                {subscription.amount}<span className="text-muted">/{subscription.interval}</span>
              </div>
            </div>

            {subscription.nextBillingDate && (
              <p className="text-muted">
                {subscription.cancel_at_period_end ? 'Cancel at period end date: ' : 'Next billing date: '} <strong>{formatDate(subscription.nextBillingDate)}</strong>
              </p>
            )}


            <div className="mt-4">
              <button
                className="btn btn-danger me-2"
                onClick={onCancelSubscription}
                disabled={subscription.status === 'canceled'}
              >
                Cancel Subscription
              </button>
              <button
                className="btn btn-primary"
                onClick={onUpgradeSubscription}
              >
                Change Subscription
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p>No active subscription found.</p>
            <button className="btn btn-primary" onClick={onUpgradeSubscription}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="profile-section">
      <div className="section-header">
        <h3 className="mb-0">Payment Methods</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={onAddPaymentMethod}
          disabled={loading}
        >
          Add Payment Method
        </button>
      </div>
      <div className="card-body">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div key={method.id} className="payment-method-card mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <i className={`fab fa-cc-${method.card.brand} fa-2x text-primary me-3`}></i>
                  <div>
                    <h6 className="mb-1">
                      {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)}
                      ending in {method.card.last4}
                      {method.default && (
                        <span className="badge bg-success ms-2">Default</span>
                      )}
                    </h6>
                    <p className="mb-1 text-muted small">
                      Expires: {method.card.expMonth.toString().padStart(2, '0')}/{method.card.expYear.toString().slice(-2)}
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onMakeDefault(method.id)}
                    disabled={method.default}
                  >
                    Make Default
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemovePaymentMethod(method.id)}
                    disabled={paymentMethods.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
            <p>No payment methods found</p>
            <button className="btn btn-primary" onClick={onAddPaymentMethod}>
              Add Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const EditProfileTab = ({
  initialUserData,
  onSave,
  onPasswordChange
}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profile_img: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update local state when initialUserData changes
  useEffect(() => {
    if (initialUserData) {
      setUserData(prev => ({
        name: initialUserData.name || '',
        email: initialUserData.email || '',
        phone: initialUserData.phone || '',
        bio: initialUserData.bio || '',
        profile_img: initialUserData.profile_img || '',
        profile_img_url: initialUserData.profile_img_url || ''
      }));
    }
  }, [initialUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (type) => {
    const newErrors = {};

    if (type === 'profile') {
      if (!userData.name?.trim()) newErrors.name = 'Name is required';
      if (!userData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else if (type === 'password') {
      if (!passwordData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!validateForm(type)) return;

    setIsLoading(true);
    try {
      if (type === 'profile') {
        const formData = new FormData();

        // Append profile data
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone || '');
        formData.append('bio', userData.bio || '');

        // Append image if selected
        if (selectedImage) {
          formData.append('profile_img', selectedImage);
        }

        await onSave(formData, 'profile');

        // Clear selected image after successful save
        if (selectedImage) {
          setSelectedImage(null);
        }
      } else {
        await onPasswordChange(passwordData);
        // Clear password fields after successful change
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      // Handle API errors here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gap-4">
      <div className="profile-section mb-4">
        <div className="section-header">
          <h3>Edit Personal Information</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e, 'profile')}>

          <div className="v-wrap">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="h-wrap">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                name="bio"
                rows="4"
                placeholder="Tell us about yourself"
                value={userData.bio}
                onChange={handleInputChange}
              />
              <div className="form-text">Write a short bio about yourself (optional)</div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </form>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h3>Change Password</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e, 'password')}>
          <div className="v-wrap">
           

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
              />
              {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
              <div className="form-text">Password must be at least 6 characters long</div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Modal Components
const RemovePaymentModal = ({ show, onHide, onConfirm, loading }) => (
  <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Removal</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          Are you sure you want to remove this payment method?
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CancelSubscriptionModal = ({ show, onHide, onConfirm, loading }) => (
  <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Cancel Subscription</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.</p>
          <div className="alert alert-warning mt-3">
            <strong>Note:</strong> You can reactivate your subscription anytime before the end of your billing period.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Yes, Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AddPaymentModal = ({ show, onHide, onSubmit, isProcessing, stripe }) => (
  <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Payment Method</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Card Details</label>
              <div className="p-3 border rounded">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Add Payment Method'}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePageWrapper = () => (
  <Elements stripe={stripePromise}>
    <ProfilePage />
  </Elements>
);

export default ProfilePageWrapper;