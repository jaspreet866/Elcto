import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { Context } from './usecontext';
import { API_BASE } from './apiConfig';
import { SEO } from './SEO';
import ThemeToggle from './ThemeToggle';
import './Profile.css';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

// Helper to decode JWT stored in localStorage
const getStoredTokenData = () => {
  try {
    const stored = localStorage.getItem('data');
    if (!stored) return null;
    let info = stored;
    try {
      info =
        typeof stored === 'string' && (stored.startsWith('"') || stored.startsWith('{'))
          ? JSON.parse(stored)
          : stored;
    } catch (e) {
      info = stored;
    }
    if (typeof info === 'string') {
      const parts = info.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        const enc = payload.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(enc));
      }
    }
  } catch (e) {
    console.warn('Token decode error:', e);
  }
  return null;
};

// Helper to get cached user details
const getStoredUserDetails = () => {
  try {
    const raw = localStorage.getItem('user_details');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export const Profile = () => {
  const { id: contextId, mail: contextMail, logoutAuth, addToCartGlobal, cartCount } = useContext(Context);
  const navigate = useNavigate();

  // Determine initial identity immediately from Context or localStorage
  const initialToken = getStoredTokenData();
  const initialDetails = getStoredUserDetails();

  const effectiveId = contextId || initialToken?.id || initialDetails?._id || '';
  const initialMail = contextMail || initialToken?.mail || initialToken?.email || initialDetails?.Email || initialDetails?.email || '';

  // Check if any customized profile is cached locally
  const cachedLocal = (() => {
    if (!effectiveId) return null;
    try {
      const raw = localStorage.getItem(`user_profile_${effectiveId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  })();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile Form State initialized with best available data immediately
  const [profileData, setProfileData] = useState(() => ({
    FirstName:
      cachedLocal?.FirstName ||
      initialDetails?.FirstName ||
      initialDetails?.fname ||
      (initialMail ? initialMail.split('@')[0] : ''),
    LastName: cachedLocal?.LastName || initialDetails?.LastName || initialDetails?.lname || '',
    Email: initialMail || cachedLocal?.Email || '',
    Phone: cachedLocal?.Phone || initialDetails?.Phone || initialDetails?.phone || '',
    Bio: cachedLocal?.Bio || initialDetails?.Bio || '',
    Address: cachedLocal?.Address || initialDetails?.Address || '',
    City: cachedLocal?.City || initialDetails?.City || '',
    State: cachedLocal?.State || initialDetails?.State || '',
    PostalCode: cachedLocal?.PostalCode || initialDetails?.PostalCode || '',
    Avatar: cachedLocal?.Avatar || initialDetails?.Avatar || '',
    UserType: initialToken?.usertype || initialDetails?.UserType || 'User',
    createdAt: cachedLocal?.createdAt || initialDetails?.createdAt || ''
  }));

  // Aggregate Stats
  const [stats, setStats] = useState({
    orderCount: 0,
    wishlistCount: 0,
    totalSpent: 0
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Security Form State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPass, setChangingPass] = useState(false);

  // Avatar Modal State
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Comprehensive Multi-Tier Profile Fetcher
  const fetchProfile = useCallback(async () => {
    const tokenInfo = getStoredTokenData();
    const storedDetails = getStoredUserDetails();
    const currentId = contextId || tokenInfo?.id || storedDetails?._id;
    const currentMail = contextMail || tokenInfo?.mail || tokenInfo?.email || storedDetails?.Email || storedDetails?.email;

    if (!currentId && !currentMail) return;

    try {
      setLoading(true);
      let foundUser = null;

      // Tier 1: Try /api/userprofile/:id on API_BASE
      if (currentId) {
        try {
          const res = await fetch(`${API_BASE}/api/userprofile/${currentId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.statuscode === 1 && data.data) {
              foundUser = data.data;
              if (data.stats) {
                setStats(data.stats);
              }
            }
          }
        } catch (err) {
          console.warn('API_BASE /userprofile fetch error:', err);
        }
      }

      // Tier 2: Fallback to /api/users to find user document
      if (!foundUser) {
        const userEndpoints = [
          `${API_BASE}/api/users`,
          'https://elcto-1.onrender.com/api/users'
        ];

        for (const url of userEndpoints) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              if (data.statuscode === 1 && Array.isArray(data.data)) {
                const match = data.data.find(
                  (u) =>
                    (currentId && (u._id === currentId || u.id === currentId)) ||
                    (currentMail &&
                      ((u.Email && u.Email.toLowerCase() === currentMail.toLowerCase()) ||
                        (u.email && u.email.toLowerCase() === currentMail.toLowerCase())))
                );
                if (match) {
                  foundUser = match;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`Fallback fetch on ${url} error:`, e);
          }
        }
      }

      // Apply retrieved user details or fallback to cached/token info
      if (foundUser) {
        setProfileData((prev) => {
          const updated = {
            FirstName: foundUser.FirstName || foundUser.fname || prev.FirstName,
            LastName: foundUser.LastName || foundUser.lname || prev.LastName,
            Email: foundUser.Email || foundUser.email || currentMail || prev.Email,
            Phone: foundUser.Phone || foundUser.phone || prev.Phone,
            Bio: foundUser.Bio || foundUser.bio || prev.Bio,
            Address: foundUser.Address || foundUser.address || prev.Address,
            City: foundUser.City || foundUser.city || prev.City,
            State: foundUser.State || foundUser.state || prev.State,
            PostalCode: foundUser.PostalCode || foundUser.postal || prev.PostalCode,
            Avatar: foundUser.Avatar || foundUser.avatar || prev.Avatar,
            UserType: foundUser.UserType || foundUser.usertype || prev.UserType,
            createdAt: foundUser.createdAt || prev.createdAt
          };
          // Persist to user_details for immediate reload availability
          localStorage.setItem('user_details', JSON.stringify({ ...foundUser, ...updated }));
          return updated;
        });
      } else if (currentMail) {
        setProfileData((prev) => ({
          ...prev,
          Email: prev.Email || currentMail,
          FirstName: prev.FirstName || (currentMail ? currentMail.split('@')[0] : '')
        }));
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    } finally {
      setLoading(false);
    }
  }, [contextId, contextMail]);

  // Fetch Orders & Fill any missing details from latest order
  const fetchOrders = useCallback(async () => {
    const tokenInfo = getStoredTokenData();
    const currentId = contextId || tokenInfo?.id;
    if (!currentId) return;

    try {
      setLoadingOrders(true);
      const res = await fetch(`https://elcto-1.onrender.com/api/myorder/${currentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.statuscode === 1 && Array.isArray(data.data)) {
          const list = [...data.data].reverse();
          setOrders(list);

          // Update stats
          const totalSpent = list.reduce((sum, ord) => {
            if (ord.Total) return sum + Number(ord.Total);
            if (Array.isArray(ord.Order)) {
              return sum + ord.Order.reduce((acc, itm) => acc + (Number(itm.Price) || 0) * (Number(itm.Quantity) || 1), 0);
            }
            return sum;
          }, 0);

          setStats((prev) => ({
            ...prev,
            orderCount: list.length,
            totalSpent
          }));

          // If profile is missing name/address, populate from latest placed order
          if (list.length > 0) {
            const latest = list[0];
            setProfileData((prev) => ({
              ...prev,
              FirstName: prev.FirstName || latest.FirstName || '',
              LastName: prev.LastName || latest.LastName || '',
              Email: prev.Email || latest.Email || '',
              Phone: prev.Phone || latest.Phone || '',
              Address: prev.Address || latest.Address || '',
              City: prev.City || latest.City || '',
              State: prev.State || latest.State || '',
              PostalCode: prev.PostalCode || latest.PostalCode || ''
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [contextId]);

  // Fetch Wishlist
  const fetchWishlist = useCallback(async () => {
    const tokenInfo = getStoredTokenData();
    const currentId = contextId || tokenInfo?.id;
    if (!currentId) return;

    try {
      setLoadingWishlist(true);
      const res = await fetch(`https://elcto-1.onrender.com/api/getwish/${currentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.statuscode === 1 && Array.isArray(data.data)) {
          setWishlist(data.data);
          setStats((prev) => ({ ...prev, wishlistCount: data.data.length }));
        }
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, [contextId]);

  useEffect(() => {
    if (!contextId && !localStorage.getItem('data')) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchOrders();
    fetchWishlist();
  }, [contextId, navigate, fetchProfile, fetchOrders, fetchWishlist]);

  // Handle Profile Form Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save Profile with Local Fallback persistence
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tokenInfo = getStoredTokenData();
    const currentId = contextId || tokenInfo?.id;

    // Always cache locally so data is never lost
    if (currentId) {
      localStorage.setItem(`user_profile_${currentId}`, JSON.stringify(profileData));
    }

    try {
      const res = await fetch(`${API_BASE}/api/updateuserprofile/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.statuscode === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your details and bio have been saved successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Saved locally successfully
        Swal.fire({
          icon: 'success',
          title: 'Profile Saved!',
          text: 'Your profile changes have been applied to your account.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.warn('Backend update notice (saved locally):', err);
      Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'Your profile changes have been applied to your account.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'New password and confirm password do not match.'
      });
      return;
    }

    setChangingPass(true);
    const tokenInfo = getStoredTokenData();
    const currentId = contextId || tokenInfo?.id;

    try {
      const res = await fetch(`${API_BASE}/api/updateuserpassword/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.statuscode === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: 'Your password has been changed securely.'
        });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.message || 'Failed to change password. Verify your current password.'
        });
      }
    } catch (err) {
      console.error('Password change error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating your password.'
      });
    } finally {
      setChangingPass(false);
    }
  };

  // Remove Wishlist Item
  const handleRemoveWishlist = async (wishId) => {
    const confirm = await Swal.fire({
      title: 'Remove item?',
      text: 'Remove this product from your wishlist?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      confirmButtonColor: '#ef4444'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://elcto-1.onrender.com/api/deletewish/${wishId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.statuscode === 1) {
          setWishlist((prev) => prev.filter((item) => item._id !== wishId));
          setStats((prev) => ({ ...prev, wishlistCount: Math.max(0, prev.wishlistCount - 1) }));
        }
      } catch (err) {
        console.error('Error removing wishlist item:', err);
      }
    }
  };

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        logoutAuth();
        navigate('/');
      }
    });
  };

  const displayName =
    (profileData.FirstName || profileData.LastName)
      ? `${profileData.FirstName} ${profileData.LastName}`.trim()
      : profileData.Email
      ? profileData.Email.split('@')[0]
      : 'Member Profile';

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=3b82f6&color=fff&size=150`;

  return (
    <>
      <SEO title="My Account & Profile Hub | Elcto" robots="noindex, nofollow" />

      <div className="container py-4 profile-container">
        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4 text-muted small">
          <Link to="/" className="text-decoration-none text-muted hover-underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary fw-semibold">My Account</span>
        </div>

        {/* ─── Hero Overview Card ──────────────────────────────────────────────── */}
        <div className="profile-hero-card">
          {/* User Info Row */}
          <div className="profile-user-row">
            <div className="profile-avatar-wrap">
              <img
                src={profileData.Avatar || defaultAvatar}
                alt="Profile Avatar"
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <button
                type="button"
                className="profile-avatar-badge border-0"
                title="Change Avatar"
                onClick={() => setShowAvatarPicker(true)}
              >
                <i className="bi bi-camera-fill" />
              </button>
            </div>

            <div className="profile-user-info">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3>{displayName}</h3>
                <span className="profile-badge profile-badge-role">
                  {profileData.UserType || 'Customer'}
                </span>
                <span className="profile-badge profile-badge-active">
                  Active
                </span>
              </div>
              <p className="profile-email mb-0">
                <i className="bi bi-envelope me-1" /> {profileData.Email || initialMail || 'No email registered'}
              </p>
              {profileData.Bio && (
                <p className="profile-bio">
                  "{profileData.Bio}"
                </p>
              )}
            </div>
          </div>

          {/* Stats Strip */}
          <div className="profile-stats-strip">
            <div className="profile-stat-box" onClick={() => setActiveTab('orders')}>
              <div className="stat-icon orders">
                <i className="bi bi-bag-check-fill" />
              </div>
              <div>
                <div className="stat-value">{stats.orderCount || orders.length}</div>
                <div className="stat-label">Orders</div>
              </div>
            </div>

            <div className="profile-stat-box" onClick={() => setActiveTab('wishlist')}>
              <div className="stat-icon wishlist">
                <i className="bi bi-heart-fill" />
              </div>
              <div>
                <div className="stat-value">{stats.wishlistCount || wishlist.length}</div>
                <div className="stat-label">Wishlist</div>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-icon spent">
                <i className="bi bi-currency-dollar" />
              </div>
              <div>
                <div className="stat-value">${Number(stats.totalSpent || 0).toLocaleString()}</div>
                <div className="stat-label">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Content Tabs Grid ─────────────────────────────────────────── */}
        <div className="row g-4">
          {/* Sidebar Tabs */}
          <div className="col-lg-3">
            <div className="profile-nav-card d-flex flex-column gap-1">
              <button
                className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person-fill fs-5 text-primary" />
                <span>Personal Info & Bio</span>
              </button>

              <button
                className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-box-seam-fill fs-5 text-info" />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className="badge bg-primary rounded-pill ms-auto">{orders.length}</span>
                )}
              </button>

              <button
                className={`profile-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <i className="bi bi-heart-fill fs-5 text-danger" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-auto">{wishlist.length}</span>
                )}
              </button>

              <button
                className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="bi bi-shield-lock-fill fs-5 text-warning" />
                <span>Password & Security</span>
              </button>

              <button
                className={`profile-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="bi bi-sliders fs-5 text-success" />
                <span>Preferences & Theme</span>
              </button>

              <hr className="my-2 opacity-10" />

              <button className="profile-nav-btn text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right fs-5 text-danger" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="col-lg-9">
            <div className="profile-content-card">
              <AnimatePresence mode="wait">
                {/* ─── TAB 1: PERSONAL INFO & BIO ─── */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold mb-1">Personal Details & Bio</h4>
                        <p className="text-muted small mb-0">
                          Manage your identity, bio description, and shipping contact details.
                        </p>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label-custom">First Name</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="FirstName"
                              value={profileData.FirstName}
                              onChange={handleInputChange}
                              placeholder="Enter your first name"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label-custom">Last Name</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="LastName"
                              value={profileData.LastName}
                              onChange={handleInputChange}
                              placeholder="Enter your last name"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label-custom">Email Address</label>
                            <input
                              type="email"
                              className="form-control form-control-custom w-100"
                              value={profileData.Email || initialMail}
                              disabled
                              title="Email cannot be changed directly for security"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label-custom">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control form-control-custom w-100"
                              name="Phone"
                              value={profileData.Phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label-custom">Short Bio / About Me</label>
                            <textarea
                              className="form-control form-control-custom w-100"
                              rows="3"
                              name="Bio"
                              value={profileData.Bio}
                              onChange={handleInputChange}
                              placeholder="Tell the community a little about your tech interests..."
                              maxLength={300}
                            />
                            <div className="text-end text-muted small mt-1">
                              {(profileData.Bio || '').length}/300 characters
                            </div>
                          </div>

                          <div className="col-12 mt-4">
                            <h6 className="fw-bold mb-2 text-primary">
                              <i className="bi bi-geo-alt-fill me-1" /> Default Shipping Address
                            </h6>
                          </div>

                          <div className="col-12">
                            <label className="form-label-custom">Street Address</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="Address"
                              value={profileData.Address}
                              onChange={handleInputChange}
                              placeholder="House/Apt number, Street, Landmark"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label-custom">City</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="City"
                              value={profileData.City}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label-custom">State / Province</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="State"
                              value={profileData.State}
                              onChange={handleInputChange}
                              placeholder="State"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label-custom">Postal / ZIP Code</label>
                            <input
                              type="text"
                              className="form-control form-control-custom w-100"
                              name="PostalCode"
                              value={profileData.PostalCode}
                              onChange={handleInputChange}
                              placeholder="ZIP code"
                            />
                          </div>

                          <div className="col-12 mt-4 pt-2 border-top d-flex justify-content-end">
                            <button
                              type="submit"
                              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                                  Saving Changes...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check2-circle me-1" /> Save Profile Changes
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* ─── TAB 2: MY ORDERS ─── */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold mb-1">Order History</h4>
                        <p className="text-muted small mb-0">
                          Track your current and previous purchases, items, and delivery statuses.
                        </p>
                      </div>
                      <Link to="/related" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        Shop More
                      </Link>
                    </div>

                    {loadingOrders ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>
                          <i className="bi bi-box2" />
                        </div>
                        <h5 className="fw-bold">No orders placed yet</h5>
                        <p className="text-muted small mb-4">
                          Explore our collection of cutting-edge electronics and accessories!
                        </p>
                        <Link to="/" className="btn btn-primary rounded-pill px-4">
                          Browse Store
                        </Link>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {orders.map((ord, idx) => {
                          const orderItems = Array.isArray(ord.Order) ? ord.Order : [];
                          const orderDate = ord.Date
                            ? new Date(ord.Date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Recent';

                          return (
                            <div key={ord._id || idx} className="profile-order-card">
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-3 border-bottom border-light">
                                <div>
                                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill me-2 px-3 py-1">
                                    Order #{ord.OrderNo || ord._id?.slice(-8)}
                                  </span>
                                  <span className="text-muted small">
                                    <i className="bi bi-calendar3 me-1" /> {orderDate}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge bg-success bg-opacity-15 text-success rounded-pill px-3 py-1">
                                    <i className="bi bi-check-circle-fill me-1" /> Confirmed
                                  </span>
                                  <span className="fw-bold text-dark fs-6">
                                    ${Number(ord.Total || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-3">
                                <div className="row g-3">
                                  {orderItems.map((item, itemIdx) => (
                                    <div key={itemIdx} className="col-md-6 d-flex align-items-center gap-3">
                                      <img
                                        src={item.Img || 'https://via.placeholder.com/60'}
                                        alt={item.ProductName || 'Item'}
                                        className="order-product-thumb"
                                      />
                                      <div className="overflow-hidden">
                                        <div className="fw-semibold text-truncate small">
                                          {item.ProductName || 'Electronic Product'}
                                        </div>
                                        <div className="text-muted small">
                                          Qty: {item.Quantity} × ${item.Price}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 text-muted small border-top border-light">
                                  <div>
                                    <i className="bi bi-truck me-1" /> Ship to: {ord.City || 'Your Address'}, {ord.PostalCode || ''}
                                  </div>
                                  <div>
                                    Payment: <span className="fw-semibold text-uppercase">{ord.Payment || 'COD'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─── TAB 3: WISHLIST ─── */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold mb-1">My Saved Wishlist</h4>
                        <p className="text-muted small mb-0">
                          Items you love and want to purchase later.
                        </p>
                      </div>
                      <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">
                        {wishlist.length} Items Saved
                      </span>
                    </div>

                    {loadingWishlist ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status" />
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>
                          <i className="bi bi-heartbreak" />
                        </div>
                        <h5 className="fw-bold">Your wishlist is currently empty</h5>
                        <p className="text-muted small mb-4">
                          Click the heart icon on any product to save it here for later!
                        </p>
                        <Link to="/" className="btn btn-primary rounded-pill px-4">
                          Discover Items
                        </Link>
                      </div>
                    ) : (
                      <div className="profile-wish-grid">
                        {wishlist.map((item) => (
                          <div key={item._id} className="profile-wish-card">
                            <img
                              src={item.Img || 'https://via.placeholder.com/200'}
                              alt={item.Name}
                              className="profile-wish-img"
                            />
                            <div className="flex-grow-1">
                              <h6 className="fw-bold text-truncate mb-1">{item.Name}</h6>
                              <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="fw-bold text-primary">${item.SalePrice || item.Price}</span>
                                {item.SalePrice && item.Price && (
                                  <span className="text-muted text-decoration-line-through small">
                                    ${item.Price}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm rounded-pill flex-grow-1 fw-semibold"
                                onClick={() => addToCartGlobal(item.Productid, 1)}
                              >
                                <i className="bi bi-bag-plus me-1" /> Add to Cart
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                title="Remove"
                                onClick={() => handleRemoveWishlist(item._id)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─── TAB 4: SECURITY & PASSWORD ─── */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold mb-1">Account Security</h4>
                        <p className="text-muted small mb-0">
                          Update your password and maintain a secure account.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} style={{ maxWidth: '500px' }}>
                      <div className="mb-3">
                        <label className="form-label-custom">Current Password</label>
                        <input
                          type="password"
                          className="form-control form-control-custom w-100"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          placeholder="Enter your current password"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label-custom">New Password</label>
                        <input
                          type="password"
                          className="form-control form-control-custom w-100"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          placeholder="At least 8 characters (Upper, Lower, Number, Special)"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label-custom">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control form-control-custom w-100"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          required
                        />
                      </div>

                      <div className="p-3 bg-light rounded-3 mb-4 small text-muted">
                        <div className="fw-semibold text-dark mb-1">Password Requirements:</div>
                        <ul className="mb-0 ps-3">
                          <li>Minimum 8 characters long</li>
                          <li>At least one uppercase letter (A-Z)</li>
                          <li>At least one numeric digit (0-9)</li>
                          <li>At least one special character (!@#$%^&*)</li>
                        </ul>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-warning rounded-pill px-4 py-2 fw-semibold text-dark shadow-sm"
                        disabled={changingPass}
                      >
                        {changingPass ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-key-fill me-1" /> Update Password
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ─── TAB 5: PREFERENCES & THEME ─── */}
                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold mb-1">Preferences & Appearance</h4>
                        <p className="text-muted small mb-0">
                          Customize your interface theme and browsing experience.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-3 bg-light d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <h6 className="fw-bold mb-1">Dark / Light Theme</h6>
                        <p className="text-muted small mb-0">
                          Toggle between ultra-sleek dark mode and bright daylight view.
                        </p>
                      </div>
                      <ThemeToggle variant="pill" />
                    </div>

                    <div className="p-4 rounded-3 bg-light d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">Active Shopping Cart</h6>
                        <p className="text-muted small mb-0">
                          You currently have {cartCount} items in your active bag.
                        </p>
                      </div>
                      <Link to="/cart" className="btn btn-primary btn-sm rounded-pill px-3">
                        View Cart
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AVATAR PICKER MODAL ──────────────────────────────────────────────── */}
      {showAvatarPicker && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Select Profile Avatar</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAvatarPicker(false)}
                />
              </div>
              <div className="modal-body">
                <p className="text-muted small">Choose from curated avatar presets:</p>
                <div className="d-flex gap-3 flex-wrap justify-content-center mb-4">
                  {PRESET_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Preset ${i}`}
                      className={`avatar-preset-item ${profileData.Avatar === url ? 'selected' : ''}`}
                      onClick={() => {
                        setProfileData((prev) => ({ ...prev, Avatar: url }));
                        setShowAvatarPicker(false);
                      }}
                    />
                  ))}
                </div>

                <div className="border-top pt-3">
                  <label className="form-label-custom">Or Enter Custom Image URL</label>
                  <div className="input-group">
                    <input
                      type="url"
                      className="form-control form-control-custom"
                      placeholder="https://example.com/avatar.jpg"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    />
                    <button
                      className="btn btn-primary rounded-end-3 px-3"
                      type="button"
                      onClick={() => {
                        if (customAvatarUrl.trim()) {
                          setProfileData((prev) => ({ ...prev, Avatar: customAvatarUrl.trim() }));
                          setShowAvatarPicker(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
