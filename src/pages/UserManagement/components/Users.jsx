import React, { useState, useEffect } from 'react';
import instance from '../../../api/axios';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllUsers , getUserSubscriptionDetails , toggleUserActiveStatus} from '../../../features/admin/user-management/userManagementSlice';
import { useDispatch } from 'react-redux';

const Users = () => {
    const dispatch = useDispatch();
    const { users , subscriptionDetails , loading ,togglingUser, error} = useSelector((state) => state.userManagement);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    // Modal states - ADDED SUBSCRIPTION HISTORY MODAL STATE
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [subscriptionHistory, setSubscriptionHistory] = useState([]);
    const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');

    // Per-user toggle loading state
    const [togglingUserId, setTogglingUserId] = useState(null);

    // Existing modal states (keep as is)
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentUser, setCurrentUser] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        plan_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch users via Redux thunk (getAllUsers) and update local pagination + filters
    const fetchUsers = async (page = 1, search = '') => {
        try {

            const resultAction = await dispatch(getAllUsers({ page, search: search.trim() }));

            if (getAllUsers.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;
                const usersResponse = payload?.users;

                if (!usersResponse) {
                    throw new Error('Invalid users response from server');
                }

                const usersData = usersResponse.data || [];
                const pagination = usersResponse;

                setFilteredUsers(usersData);

                setCurrentPage(pagination.current_page || 1);
                setTotalPages(pagination.last_page || 1);
                setTotalItems(pagination.total || 0);
                setPerPage(pagination.per_page || usersData.length || 10);
                setFrom(pagination.from || 0);
                setTo(pagination.to || 0);

            } else {
                // Thunk was rejected
                const err = resultAction.error || {};
                let errorMessage = 'Failed to load users. ' + (err.message || 'Unknown error occurred.');

                setFilteredUsers([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalItems(0);
                setFrom(0);
                setTo(0);
            }
        } catch (err) {
            console.error('Error fetching users:', err);

            let errorMessage = 'Failed to load users. ';

            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage += 'Please log in again.';
                } else if (err.response.status === 403) {
                    errorMessage += 'You do not have permission to view users.';
                } else if (err.response.status === 404) {
                    errorMessage += 'API endpoint not found. Please check the URL.';
                } else if (err.response.status === 500) {
                    errorMessage += 'Server error. Please try again later.';
                }
            } else if (err.request) {
                errorMessage += 'No response from server. Check your network connection.';
            } else {
                errorMessage += err.message || 'Unknown error occurred.';
            }


            setFilteredUsers([]);

            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);
            setFrom(0);
            setTo(0);
        } finally {
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search with debouncing - NO CHANGES
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== '') {
                fetchUsers(1, searchTerm);
            } else {
                fetchUsers(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    const handleToggleUser = async (userId, currentStatus) => {
        setTogglingUserId(userId);
        try {
            dispatch(toggleUserActiveStatus(userId));
            fetchUsers(currentPage, searchTerm);
            toast.success('User status updated successfully');
        } catch (err) {
            console.error('Toggle user error:', err);
            toast.error('Failed to update user status');
        } finally {
            setTogglingUserId(null);
        }
    };

    // NEW FUNCTION: Fetch subscription history via Redux thunk
    const fetchSubscriptionHistory = async (userId, userName) => {
        try {
            setSubscriptionLoading(true);
            setSelectedUserId(userId);
            setSelectedUserName(userName);

            const resultAction = await dispatch(getUserSubscriptionDetails(userId));

            if (getUserSubscriptionDetails.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;
                // payload is response.data from API helper
                const subscriptions = payload?.subscriptions || [];
                const firstSub = subscriptions[0] || null;

                if (firstSub) {
                    setSubscriptionHistory(firstSub.history || []);
                    setCurrentSubscriptionPlan(firstSub);
                } else {
                    setSubscriptionHistory([]);
                    setCurrentSubscriptionPlan(null);
                }

                setShowSubscriptionModal(true);
            } else {
                console.error('Error fetching subscription history:', resultAction.error);
                toast.error('Failed to load subscription history');
            }
        } catch (err) {
            console.error('Error fetching subscription history:', err);
            toast.error('Failed to load subscription history');
        } finally {
            setSubscriptionLoading(false);
        }
    };

    // NEW FUNCTION: Close subscription modal
    const closeSubscriptionModal = () => {
        setShowSubscriptionModal(false);
        setSubscriptionHistory([]);
        setCurrentSubscriptionPlan(null);
        setSelectedUserId(null);
        setSelectedUserName('');
    };

    // Handle page change - NO CHANGES
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchUsers(page, searchTerm);
        }
    };

    // Format date for display - NO CHANGES
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Get plan name from plan_id - NO CHANGES
    const getPlanName = (planId) => {
        const plans = {
            1: 'Free',
            2: 'Premium',
            3: 'Enterprise'
        };
        return plans[planId] || `${planId}`;
    };

    // Helper function to safely render user data - NO CHANGES
    const getUserDisplayData = (user, field) => {
        if (!user || typeof user !== 'object') return '';
        return user[field] || '';
    };

    // Ensure filteredUsers is always an array - NO CHANGES
    const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];

    // Debug function - NO CHANGES
    const testApiEndpoint = async () => {
        try {
            const response = await instance.get('/users/management');
            // console.log('API Test Response:', response.data);
            toast.success('API connection successful!');
        } catch (error) {
            console.error('API Test Error:', error);
            toast.error('API connection failed!');
        }
    };

    // Close existing modal - NO CHANGES
    const closeModal = () => {
        setShowModal(false);
        setCurrentUser({
            id: null,
            name: '',
            email: '',
            phone: '',
            plan_id: ''
        });
        setErrors({
            name: '',
            email: '',
            phone: '',
            plan_id: ''
        });
    };

    // Handle form submissions - NO CHANGES
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    // Handle input changes - NO CHANGES
    const handleNameChange = (e) => {
        const value = e.target.value;
        setCurrentUser(prev => ({ ...prev, name: value }));
    };

    // Render loading state - NO CHANGES
    if (loading && users.length === 0) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading Users...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">
            {/* Existing header - NO CHANGES */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 mb-1">User Management</h2>
                    <p className="text-muted mb-0">Manage users and their Roles</p>
                </div>
            </div>

            {/* Debug button - NO CHANGES */}
            {error && (
                <div className="mb-3">
                    <button
                        className="btn btn-sm btn-warning"
                        onClick={testApiEndpoint}
                    >
                        <Icon icon="tabler:bug" width={18} height={18} />
                        Debug API Connection
                    </button>
                    <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={() => {
                            console.log('Current users state:', users);
                            console.log('Filtered users state:', filteredUsers);
                            // console.log('Access token:', localStorage.getItem('access_token'));
                        }}
                    >
                        <Icon icon="tabler:bug" width={18} height={18} />
                        Log State
                    </button>
                </div>
            )}

            {/* Top Bar with Search, Filter, and Create Button - NO CHANGES */}
            <div className="card mb-4 border">
                <div className="card-body p-3">
                    <div className="row align-items-center">
                        <div className="col-md-12 mb-3 mb-md-0 d-flex gap-2">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Icon icon="tabler:search" width={18} height={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search Users with Name, Phone no and Email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <Icon icon="tabler:x" width={18} height={18} />
                                    </button>
                                )}
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => fetchUsers(1, searchTerm)}
                                disabled={loading}
                                style={{ minWidth: 'fit-content' }}
                            >
                                <Icon icon="tabler:refresh" width={18} height={18} className={loading ? 'spin' : ''} />
                                Refresh Table
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Display - NO CHANGES */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    <Icon icon="tabler:alert-triangle" width={20} height={20} className="me-2" />
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {/* Users Table - ADDED SUBSCRIPTION BUTTON */}
            <div className="card mb-4 overflow-hidden border">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>Email</th>
                                    <th>Active Plan</th>
                                    <th>Created At</th>
                                    <th className="pe-4">Role</th>
                                    <th className="pe-4">Subscription</th>
                                    <th className="pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeFilteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        {console.log('Rendering user:', user)}
                                        <td className="ps-4">
                                            <span className="badge bg-light text-dark">#{user.id}</span>
                                        </td>
                                        <td>
                                            <h6 className="mb-0">{user.name}</h6>
                                        </td>
                                        <td>
                                            <small className="text-dark">{user.phone}</small>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {/* {user.email_verified_at ? '✔️' : '❌'}  */}
                                                {user.email}
                                            </small>
                                        </td>
                                        <td>
                                            <small className={``}>
                                                {user.plan?.name || 'No Plan'}  
                                            </small>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {formatDate(user.created_at)}
                                            </small>
                                        </td>
                                        <td className="pe-4">
                                            <small className="text-dark">{user.roles[0]?.name || 'No Role'}</small>
                                        </td>
                                        <td className="pe-4">
                                            {/* ADDED SUBSCRIPTION HISTORY BUTTON */}
                                            <button
                                                disabled={user.plan_id === null || loading}
                                                className="btn btn-sm btn-primary"
                                                onClick={() => fetchSubscriptionHistory(
                                                    user.id,
                                                    user.name
                                                )}
                                                title="View Subscription History"
                                            >
                                                <Icon icon="tabler:history" width={16} height={16} />
                                                <span className="ms-1 d-none d-md-inline">Subscriptions</span>
                                            </button>
                                        </td>
                                        <td className="pe-4">
                                           <button
                                            className={`btn btn-sm ${user.is_active ? 'btn-success' : 'btn-danger'}`}
                                            onClick={() => handleToggleUser(user.id, user.is_active)}
                                            disabled={togglingUserId === user.id || loading }
                                            title={user.is_active ? 'Disable User' : 'Enable User'}
                                            >
                                            {togglingUserId === user.id ? (
                                                <span className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                                </span>
                                            ) : (
                                                <Icon icon={user.is_active ? 'tabler:toggle-right' : 'tabler:toggle-left'} width={16} height={16} />
                                            )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination - NO CHANGES */}
                {totalPages > 1 && (
                    <div className="card-footer border-top">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div className="mb-2 mb-md-0">
                                <small className="text-muted">
                                    Showing {from} to {to} of {totalItems} entries
                                </small>
                            </div>
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    
                                    {currentPage > 2 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                        </li>
                                    )}
                                    
                                    {currentPage > 3 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    
                                    {currentPage > 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                {currentPage - 1}
                                            </button>
                                        </li>
                                    )}
                                    
                                    <li className="page-item active">
                                        <span className="page-link">{currentPage}</span>
                                    </li>
                                    
                                    {currentPage < totalPages && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                {currentPage + 1}
                                            </button>
                                        </li>
                                    )}
                                    
                                    {currentPage < totalPages - 2 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    
                                    {currentPage < totalPages - 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </li>
                                    )}
                                    
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* NEW: SUBSCRIPTION HISTORY MODAL */}
            {showSubscriptionModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow">
                            {/* Modal Header */}
                            <div className="modal-header bg-light border-bottom">
                                <h5 className="modal-title">
                                    <Icon icon="tabler:calendar-time" width={20} height={20} className="me-2" />
                                    Subscription History - {selectedUserName}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={closeSubscriptionModal}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                {/* Current Plan Section */}
                                <div className="card mb-4 border">
                                    <div className="card-body">
                                        <h6 className="mb-3">
                                            <Icon icon="tabler:crown" width={18} height={18} className="me-2 text-warning" />
                                            Current Active Plan
                                        </h6>
                                        
                                        {subscriptionLoading ? (
                                            <div className="text-center py-3">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="ms-2">Loading current plan...</span>
                                            </div>
                                        ) : currentSubscriptionPlan ? (
                                            <div className="row align-items-center">
                                                <div className="col-md-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 ms-3">
                                                            <h5 className="mb-1">{currentSubscriptionPlan.name || 'N/A'}</h5>
                                                            <span className="badge bg-primary-subtle text-primary">
                                                                {`${currentSubscriptionPlan.payment.payment_amount} (${currentSubscriptionPlan.payment.payment_currency})`}
                                                            </span>
                                                            <p className="text-muted mb-1">
                                                                <Icon icon="tabler:calendar" width={14} height={14} className="me-1" />
                                                                Starts: <small>{formatDate(currentSubscriptionPlan.starts_at)}</small>
                                                            </p>
                                                            {currentSubscriptionPlan.ends_at && (
                                                                <p className="text-muted mb-0">
                                                                    <Icon icon="tabler:calendar-off" width={14} height={14} className="me-1" />
                                                                    Ends: <small>{formatDate(currentSubscriptionPlan.ends_at)}</small>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-md-end">
                                                    <div className="mt-2 mt-md-0">
                                                        <span className={`badge ${
                                                            currentSubscriptionPlan.status === 'active' ? 'bg-success-subtle text-success' :
                                                            currentSubscriptionPlan.status === 'canceled' ? 'bg-danger-subtle text-danger' :
                                                            currentSubscriptionPlan.status === 'past_due' ? 'bg-warning-subtle text-warning' :
                                                            'bg-secondary-subtle text-secondary'
                                                        }`}>
                                                            {currentSubscriptionPlan.status?.charAt(0).toUpperCase() + currentSubscriptionPlan.status?.slice(1) || 'Unknown'}
                                                        </span>
                                                        {currentSubscriptionPlan.amount && (
                                                            <div className="mt-2">
                                                                <span className="fw-semibold">
                                                                    ${parseFloat(currentSubscriptionPlan.amount).toFixed(2)}
                                                                </span>
                                                                {currentSubscriptionPlan.billing_cycle && (
                                                                    <small className="text-muted ms-1">
                                                                        / {currentSubscriptionPlan.billing_cycle}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-3">
                                                <Icon icon="tabler:calendar-off" width={32} height={32} className="text-muted mb-2" />
                                                <p className="text-muted mb-0">No active subscription found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subscription History Section */}
                                <div className="card border">
                                    <div className="card-body">
                                        <h6 className="mb-3">
                                            <Icon icon="tabler:history" width={18} height={18} className="me-2" />
                                            Subscription History
                                        </h6>
                                        
                                        {subscriptionLoading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2 text-muted">Loading subscription history...</p>
                                            </div>
                                        ) : subscriptionHistory.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Plan</th>
                                                            <th>Status</th>
                                                            <th>Amount</th>
                                                            <th>Start Date</th>
                                                            <th>End Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {subscriptionHistory.map((subscription, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <span className="ms-2">{subscription.name || 'N/A'}</span>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge ${
                                                                        subscription.status === 'active' ? 'bg-success-subtle text-success' :
                                                                        subscription.status === 'canceled' ? 'bg-danger-subtle text-danger' :
                                                                        subscription.status === 'past_due' ? 'bg-warning-subtle text-warning' :
                                                                        'bg-secondary-subtle text-secondary'
                                                                    }`}>
                                                                        {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1) || 'Unknown'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <small className="text-muted">
                                                                        {`${subscription.payment.payment_amount} (${subscription.payment.payment_currency})`}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <small className="text-muted">
                                                                        {formatDate(subscription.starts_at)}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <small className="text-muted">
                                                                        {formatDate(subscription.ends_at)}
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <Icon icon="tabler:calendar-off" width={48} height={48} className="text-muted mb-3" />
                                                <p className="text-muted mb-0">No subscription history found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer border-top">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeSubscriptionModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Users;