import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';

const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentPermission, setCurrentPermission] = useState({
        id: null,
        name: '',
        slug: ''
    });
    const [isSlugManual, setIsSlugManual] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form validation states
    const [errors, setErrors] = useState({
        name: '',
        slug: ''
    });

    // Fetch permissions from API using your configured instance
    const fetchPermissions = async () => {
        try {
            setLoading(true);

            const response = await instance.get('/access-control/permissions');

            // Check if response.data is valid
            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Handle different response structures
            let permissionsData = [];
            if (Array.isArray(response.data)) {
                permissionsData = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                // Laravel paginated response
                permissionsData = response.data.data;
            } else if (typeof response.data === 'object') {
                // Try to extract array from object
                permissionsData = Object.values(response.data);
            }

            // console.log('Processed permissions data:', permissionsData);

            if (!Array.isArray(permissionsData)) {
                throw new Error('Invalid data format received from server');
            }

            setPermissions(permissionsData);
            setFilteredPermissions(permissionsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching permissions:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                config: err.config
            });

            let errorMessage = 'Failed to load permissions. ';

            if (err.response) {
                // Server responded with error status
                if (err.response.status === 401) {
                    errorMessage += 'Please log in again.';
                } else if (err.response.status === 403) {
                    errorMessage += 'You do not have permission to view permissions.';
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
            setPermissions([]);
            setFilteredPermissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    // Apply search and filter
    useEffect(() => {
        if (!Array.isArray(permissions)) {
            setFilteredPermissions([]);
            return;
        }

        let result = [...permissions];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(permission => {
                if (!permission || typeof permission !== 'object') return false;
                const name = permission.name ? permission.name.toLowerCase() : '';
                const slug = permission.slug ? permission.slug.toLowerCase() : '';
                return name.includes(term) || slug.includes(term);
            });
        }

        setFilteredPermissions(result);
    }, [permissions, searchTerm]);

    // Generate slug from name - improved for multiple words
    const generateSlug = (name) => {
        if (!name) return '';

        // Convert to lowercase, replace multiple spaces with single hyphen
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Handle name change in modal
    const handleNameChange = (e) => {
        const name = e.target.value;
        setCurrentPermission(prev => ({
            ...prev,
            name,
            slug: !isSlugManual ? generateSlug(name) : prev.slug
        }));

        // Clear error when user starts typing
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    };

    // Handle slug change in modal
    const handleSlugChange = (e) => {
        const slug = e.target.value;
        setCurrentPermission(prev => ({
            ...prev,
            slug: slug.toLowerCase().replace(/\s+/g, '-')
        }));

        // Clear error when user starts typing
        if (errors.slug) {
            setErrors(prev => ({ ...prev, slug: '' }));
        }
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {
            name: '',
            slug: ''
        };

        let isValid = true;

        // Validate name
        if (!currentPermission.name.trim()) {
            newErrors.name = 'Permission name is required';
            isValid = false;
        } else if (currentPermission.name.trim().length < 3) {
            newErrors.name = 'Permission name must be at least 3 characters';
            isValid = false;
        } else if (currentPermission.name.trim().length > 100) {
            newErrors.name = 'Permission name cannot exceed 100 characters';
            isValid = false;
        }

        // Validate slug
        if (!currentPermission.slug.trim()) {
            newErrors.slug = 'Slug is required';
            isValid = false;
        } else if (!/^[a-z0-9-]+$/.test(currentPermission.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
            isValid = false;
        } else if (currentPermission.slug.length < 3) {
            newErrors.slug = 'Slug must be at least 3 characters';
            isValid = false;
        } else if (currentPermission.slug.length > 100) {
            newErrors.slug = 'Slug cannot exceed 100 characters';
            isValid = false;
        } else if (currentPermission.slug.startsWith('-') || currentPermission.slug.endsWith('-')) {
            newErrors.slug = 'Slug cannot start or end with a hyphen';
            isValid = false;
        } else if (currentPermission.slug.includes('--')) {
            newErrors.slug = 'Slug cannot contain consecutive hyphens';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Open create modal
    const handleCreateClick = () => {
        setModalMode('create');
        setCurrentPermission({
            id: null,
            name: '',
            slug: ''
        });
        setIsSlugManual(false);
        setErrors({ name: '', slug: '' });
        setShowModal(true);
    };

    // Open edit modal
    const handleEditClick = (permission) => {
        if (!permission || typeof permission !== 'object') return;

        setModalMode('edit');
        setCurrentPermission({
            id: permission.id || null,
            name: permission.name || '',
            slug: permission.slug || ''
        });
        setIsSlugManual(true); // Keep existing slug for edits
        setErrors({ name: '', slug: '' });
        setShowModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            if (modalMode === 'create') {
                // Create new permission using your configured instance
                await instance.post('/access-control/permissions', {
                    name: currentPermission.name.trim(),
                    slug: currentPermission.slug.trim()
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Permission created successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Update existing permission using your configured instance
                const formData = new FormData();
                formData.append('name', currentPermission.name.trim());
                formData.append('slug', currentPermission.slug.trim());
                formData.append('_method', 'PUT');

                await instance.post(`/access-control/permissions/${currentPermission.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Permission updated successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setShowModal(false);
            fetchPermissions(); // Refresh the list
        } catch (err) {
            console.error('Error saving permission:', err);
            let errorMessage = 'Failed to save permission. ';

            if (err.response?.data?.errors) {
                // Laravel validation errors - update our form errors
                const serverErrors = err.response.data.errors;
                const newErrors = { name: '', slug: '' };

                if (serverErrors.name) {
                    newErrors.name = serverErrors.name.join(', ');
                }
                if (serverErrors.slug) {
                    newErrors.slug = serverErrors.slug.join(', ');
                }

                setErrors(newErrors);

                // Show only if there are other errors not related to form fields
                const nonFieldErrors = Object.keys(serverErrors).filter(
                    key => !['name', 'slug'].includes(key)
                );
                if (nonFieldErrors.length > 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Please check the form for errors'
                    });
                }
            } else if (err.response?.data?.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.response.data.message
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to save permission. Please try again.'
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDeleteClick = async (permission) => {
        if (!permission || !permission.id) return;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${permission.name || 'this permission'}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await instance.delete(`/access-control/permissions/${permission.id}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Permission has been deleted.',
                    timer: 2000,
                    showConfirmButton: false
                });

                fetchPermissions(); // Refresh the list
            } catch (err) {
                console.error('Error deleting permission:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.response?.data?.message || 'Failed to delete permission. Please try again.'
                });
            }
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

    // Helper function to safely render permission data
    const getPermissionDisplayData = (permission, field) => {
        if (!permission || typeof permission !== 'object') return '';
        return permission[field] || '';
    };

    // Ensure filteredPermissions is always an array
    const safeFilteredPermissions = Array.isArray(filteredPermissions) ? filteredPermissions : [];

    // Test function to check API endpoint
    const testApiEndpoint = async () => {
        try {
            console.log('Testing API endpoint...');
            const token = localStorage.getItem('access_token');
            console.log('Access token exists:', !!token);

            const testResponse = await instance.get('/access-control/permissions');
            console.log('API test successful:', testResponse);

            if (testResponse.data) {
                console.log('Response data:', testResponse.data);
            }
        } catch (error) {
            console.error('API test failed:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                config: error.config
            });
        }
    };

    // Close modal and reset errors
    const closeModal = () => {
        setShowModal(false);
        setErrors({ name: '', slug: '' });
    };

    // Render loading state
    if (loading && permissions.length === 0) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading permissions...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 mb-1">Permission Management</h2>
                    <p className="text-muted mb-0">Manage user permissions</p>
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
                            console.log('Current permissions state:', permissions);
                            console.log('Filtered permissions state:', filteredPermissions);
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
                                    placeholder="Search permissions by name or slug..."
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
                                onClick={handleCreateClick}
                                style={{ minWidth: 'fit-content' }}
                            >
                                <Icon icon="tabler:plus" width={18} height={18} />
                                Create Permission
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={fetchPermissions}
                                disabled={loading}
                                style={{ minWidth: 'fit-content' }}
                            >
                                <Icon icon="tabler:refresh" width={18} height={18} className={loading ? 'spin' : ''} />
                                Refresh
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

            {/* Permissions Table */}
            <div className="card mb-5 overflow-hidden border">

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Permission Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Created At</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeFilteredPermissions.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="text-muted">
                                                <Icon icon="tabler:shield-off" width={64} height={64} className="d-block mb-3 mx-auto" />
                                                {searchTerm ? 'No permissions found matching your search' : 'No permissions found'}
                                                {error && (
                                                    <div className="mt-3">
                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={testApiEndpoint}
                                                        >
                                                            <Icon icon="tabler:bug" width={16} height={16} className="me-1" />
                                                            Test API Connection
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    safeFilteredPermissions.map((permission) => (
                                        <tr key={permission.id}>
                                            <td className="ps-4">
                                                <span className="badge bg-light text-dark">#{getPermissionDisplayData(permission, 'id')}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-sm me-3">
                                                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                                                            <Icon icon="tabler:shield-check" width={18} height={18} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0">{getPermissionDisplayData(permission, 'name')}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <code className="text-dark">{getPermissionDisplayData(permission, 'slug')}</code>
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    {getPermissionDisplayData(permission, 'name').toLowerCase().replace(/-/g, ' ')} access permission
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {formatDate(getPermissionDisplayData(permission, 'created_at'))}
                                                </small>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-primary"
                                                        title="Edit permission"
                                                        onClick={() => handleEditClick(permission)}
                                                    >
                                                        <Icon icon="tabler:pencil" width={16} height={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        title="Delete permission"
                                                        onClick={() => handleDeleteClick(permission)}
                                                    >
                                                        <Icon icon="tabler:trash" width={16} height={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Create/Edit Permission Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalMode === 'create' ? 'Create New Permission' : 'Edit Permission'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    disabled={submitting}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="permissionName" className="form-label">
                                            Permission Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="permissionName"
                                            placeholder="e.g., Manage Backend Users and Permissions"
                                            value={currentPermission.name}
                                            onChange={handleNameChange}
                                            disabled={submitting}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">
                                                {errors.name}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            Enter a descriptive name for the permission (3-100 characters)
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label htmlFor="permissionSlug" className="form-label mb-0">
                                                Slug <span className="text-danger">*</span>
                                            </label>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="manualSlug"
                                                    checked={isSlugManual}
                                                    onChange={(e) => {
                                                        setIsSlugManual(e.target.checked);
                                                        if (!e.target.checked) {
                                                            setCurrentPermission(prev => ({
                                                                ...prev,
                                                                slug: generateSlug(prev.name)
                                                            }));
                                                        }
                                                    }}
                                                    disabled={submitting}
                                                />
                                                <label className="form-check-label small" htmlFor="manualSlug">
                                                    Manual entry
                                                </label>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                                            id="permissionSlug"
                                            placeholder="e.g., manage-backend-users-and-permissions"
                                            value={currentPermission.slug}
                                            onChange={handleSlugChange}
                                            disabled={submitting || !isSlugManual}
                                            required
                                        />
                                        {errors.slug && (
                                            <div className="invalid-feedback d-block">
                                                {errors.slug}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            URL-friendly identifier (lowercase letters, numbers, and hyphens only)
                                        </div>
                                        {!isSlugManual && currentPermission.name && (
                                            <div className="text-info small mt-1">
                                                <Icon icon="tabler:info-circle" width={14} height={14} className="me-1" />
                                                Auto-generated: {currentPermission.slug}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                                            </>
                                        ) : (
                                            <>
                                                {modalMode === 'create' ? 'Create Permission' : 'Update Permission'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Permissions;