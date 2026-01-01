import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentUser, setCurrentUser] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        plan_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Form validation states
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        plan_id: ''
    });

    // Fetch users from API using your configured instance
    const fetchUsers = async (page = 1, search = '') => {
        try {
            setLoading(true);
            
            let url = `/users/management?page=${page}`;
            if (search) {
                url += `&search=${encodeURIComponent(search.trim())}`;
            }

            const response = await instance.get(url);

            // Check if response.data is valid
            if (!response.data) {
                throw new Error('No data received from server');
            }

            console.log('Raw User data from API:', response.data.users);

            let usersData = response.data.users.data;
            const pagination = response.data.users;

            setUsers(usersData);
            setFilteredUsers(usersData);
            
            // Set pagination data
            setCurrentPage(pagination.current_page);
            setTotalPages(pagination.last_page);
            setTotalItems(pagination.total);
            setPerPage(pagination.per_page);
            setFrom(pagination.from || 0);
            setTo(pagination.to || 0);
            
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                config: err.config
            });

            let errorMessage = 'Failed to load users. ';

            if (err.response) {
                // Server responded with error status
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
                // Request was made but no response
                errorMessage += 'No response from server. Check your network connection.';
            } else {
                // Something else happened
                errorMessage += err.message || 'Unknown error occurred.';
            }

            setError(errorMessage);
            setUsers([]);
            setFilteredUsers([]);
            
            // Reset pagination on error
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);
            setFrom(0);
            setTo(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== '') {
                fetchUsers(1, searchTerm);
            } else {
                fetchUsers(1);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchUsers(page, searchTerm);
        }
    };

    // Format date for display
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

    // Get plan name from plan_id
    const getPlanName = (planId) => {
        const plans = {
            1: 'Free',
            2: 'Premium',
            3: 'Enterprise'
            // Add more plan mappings as needed
        };
        return plans[planId] || `Plan ${planId}`;
    };

    // Helper function to safely render user data
    const getUserDisplayData = (user, field) => {
        if (!user || typeof user !== 'object') return '';
        return user[field] || '';
    };

    // Ensure filteredUsers is always an array
    const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];

    // Debug function
    const testApiEndpoint = async () => {
        try {
            const response = await instance.get('/users/management');
            console.log('API Test Response:', response.data);
            toast.success('API connection successful!');
        } catch (error) {
            console.error('API Test Error:', error);
            toast.error('API connection failed!');
        }
    };

    // Close modal
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

    // Handle form submissions
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    // Handle input changes
    const handleNameChange = (e) => {
        const value = e.target.value;
        setCurrentUser(prev => ({ ...prev, name: value }));
        // Add validation if needed
    };

    // Render loading state
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

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 mb-1">User Management</h2>
                    <p className="text-muted mb-0">Manage users and their Roles</p>
                </div>
            </div>

            {/* Debug button - show when there's an error */}
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
                            console.log('Access token:', localStorage.getItem('access_token'));
                        }}
                    >
                        <Icon icon="tabler:bug" width={18} height={18} />
                        Log State
                    </button>
                </div>
            )}

            {/* Top Bar with Search, Filter, and Create Button */}
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

            {/* Error Display */}
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

            {/* Users Table */}
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
                                </tr>
                            </thead>
                            <tbody>
                                {safeFilteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="ps-4">
                                            <span className="badge bg-light text-dark">#{getUserDisplayData(user, 'id')}</span>
                                        </td>
                                        <td>
                                            <h6 className="mb-0">{getUserDisplayData(user, 'name')}</h6>
                                        </td>
                                        <td>
                                            <small className="text-dark">{getUserDisplayData(user, 'phone')}</small>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {user.email_verified_at ? '✔️' : '❌'} {getUserDisplayData(user, 'email')}
                                            </small>
                                        </td>
                                        <td>
                                            {/* Plan Name Static Currently */}
                                            <small className={``}>
                                                {getPlanName(getUserDisplayData(user, 'plan_id'))}  
                                            </small>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {formatDate(getUserDisplayData(user, 'created_at'))}
                                            </small>
                                        </td>
                                        <td className="pe-4">
                                            <small className="text-dark">{getUserDisplayData(user, 'role')}</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
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
                                    
                                    {/* First page */}
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
                                    
                                    {/* Ellipsis if needed */}
                                    {currentPage > 3 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    
                                    {/* Previous page */}
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
                                    
                                    {/* Current page */}
                                    <li className="page-item active">
                                        <span className="page-link">{currentPage}</span>
                                    </li>
                                    
                                    {/* Next page */}
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
                                    
                                    {/* Ellipsis if needed */}
                                    {currentPage < totalPages - 2 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    
                                    {/* Last page */}
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

        </div>
    );
};

export default Users;