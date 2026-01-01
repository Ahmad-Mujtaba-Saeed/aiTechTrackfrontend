import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: '',
    slug: '',
    description: '',
    permission_ids: []
  });
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form validation states
  const [errors, setErrors] = useState({
    name: '',
    slug: '',
    description: '',
    permission_ids: ''
  });

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/access-control/roles');

      // Handle different response structures
      let rolesData = [];
      if (Array.isArray(response.data)) {
        rolesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        rolesData = response.data.data;
      } else if (typeof response.data === 'object') {
        rolesData = Object.values(response.data);
      }

      if (!Array.isArray(rolesData)) {
        throw new Error('Invalid data format received from server');
      }

      setRoles(rolesData);
      setFilteredRoles(rolesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please try again.');
      setRoles([]);
      setFilteredRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions from API
  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const response = await instance.get('/access-control/permissions');

      let permissionsData = [];
      if (Array.isArray(response.data)) {
        permissionsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        permissionsData = response.data.data;
      } else if (typeof response.data === 'object') {
        permissionsData = Object.values(response.data);
      }

      if (Array.isArray(permissionsData)) {
        // Sort permissions by name for consistent display
        permissionsData.sort((a, b) => a.name.localeCompare(b.name));
        setPermissions(permissionsData);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Apply search filter
  useEffect(() => {
    if (!Array.isArray(roles)) {
      setFilteredRoles([]);
      return;
    }

    let result = [...roles];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(role => {
        if (!role || typeof role !== 'object') return false;
        const name = role.name ? role.name.toLowerCase() : '';
        const slug = role.slug ? role.slug.toLowerCase() : '';
        const description = role.description ? role.description.toLowerCase() : '';
        return name.includes(term) || slug.includes(term) || description.includes(term);
      });
    }

    setFilteredRoles(result);
  }, [roles, searchTerm]);

  // Generate slug from name
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Check if role has permission
  const hasPermission = (role, permissionId) => {
    if (!role.permissions || !Array.isArray(role.permissions)) return false;
    return role.permissions.some(p => p.id === permissionId);
  };

  // Get permission count for a role
  const getPermissionCount = (role) => {
    if (!role.permissions || !Array.isArray(role.permissions)) return 0;
    return role.permissions.length;
  };

  // Handle form field changes
  const handleNameChange = (e) => {
    const name = e.target.value;
    setCurrentRole(prev => ({
      ...prev,
      name,
      slug: !isSlugManual ? generateSlug(name) : prev.slug
    }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value;
    setCurrentRole(prev => ({
      ...prev,
      slug: slug.toLowerCase().replace(/\s+/g, '-')
    }));
    if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setCurrentRole(prev => ({ ...prev, description }));
    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
  };

  const handlePermissionToggle = (permissionId) => {
    setCurrentRole(prev => {
      const newPermissionIds = prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId];
      return { ...prev, permission_ids: newPermissionIds };
    });
    if (errors.permission_ids) setErrors(prev => ({ ...prev, permission_ids: '' }));
  };

  const handleSelectAllPermissions = () => {
    if (!Array.isArray(permissions)) return;
    const allPermissionIds = permissions.map(p => p.id);
    const isAllSelected = allPermissionIds.every(id => currentRole.permission_ids.includes(id));
    setCurrentRole(prev => ({
      ...prev,
      permission_ids: isAllSelected ? [] : allPermissionIds
    }));
    if (errors.permission_ids) setErrors(prev => ({ ...prev, permission_ids: '' }));
  };

  // Open create modal
  const handleCreateClick = () => {
    setModalMode('create');
    setCurrentRole({
      id: null,
      name: '',
      slug: '',
      description: '',
      permission_ids: []
    });
    setIsSlugManual(false);
    setErrors({ name: '', slug: '', description: '', permission_ids: '' });
    setShowModal(true);
  };

  // Open edit modal
  const handleEditClick = (role) => {
    if (!role || typeof role !== 'object') return;
    setModalMode('edit');
    setCurrentRole({
      id: role.id || null,
      name: role.name || '',
      slug: role.slug || '',
      description: role.description || '',
      permission_ids: role.permissions ? role.permissions.map(p => p.id) : []
    });
    setIsSlugManual(true);
    setErrors({ name: '', slug: '', description: '', permission_ids: '' });
    setShowModal(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = { name: '', slug: '', description: '', permission_ids: '' };
    let isValid = true;

    if (!currentRole.name.trim()) {
      newErrors.name = 'Role name is required';
      isValid = false;
    } else if (currentRole.name.trim().length < 3) {
      newErrors.name = 'Role name must be at least 3 characters';
      isValid = false;
    }

    if (!currentRole.slug.trim()) {
      newErrors.slug = 'Slug is required';
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(currentRole.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', currentRole.name.trim());
      formData.append('slug', currentRole.slug.trim());
      formData.append('description', currentRole.description.trim());
      currentRole.permission_ids.forEach(id => {
        formData.append('permission_ids[]', id);
      });

      if (modalMode === 'create') {
        await instance.post('/access-control/roles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Role created successfully', timer: 2000 });
      } else {
        formData.append('_method', 'PUT');
        await instance.post(`/access-control/roles/${currentRole.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Role updated successfully', timer: 2000 });
      }

      setShowModal(false);
      fetchRoles();
    } catch (err) {
      console.error('Error saving role:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save role'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteClick = async (role) => {
    if (!role || !role.id) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${role.name || 'this role'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await instance.delete(`/access-control/roles/${role.id}`);
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Role deleted.', timer: 2000 });
        fetchRoles();
      } catch (err) {
        console.error('Error deleting role:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete role' });
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setErrors({ name: '', slug: '', description: '', permission_ids: '' });
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const category = permission.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push(permission);
    return groups;
  }, {});

  const safeFilteredRoles = Array.isArray(filteredRoles) ? filteredRoles : [];

  // Render loading state
  if (loading && roles.length === 0) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <span className="ms-3">Loading roles...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-1">Roles Management</h2>
          <p className="text-muted mb-0">Manage user roles and assign permissions</p>
        </div>

      </div>

      {/* Search Bar */}
      <div className="card mb-4 border">
        <div className="card-body p-3 d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0">
              <Icon icon="tabler:search" width={18} height={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search roles by name, slug, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                <Icon icon="tabler:x" width={18} height={18} />
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleCreateClick} style={{ minWidth: 'fit-content' }}>
            <Icon icon="tabler:plus" width={18} height={18} className="me-1" />
            Create Role
          </button>
          <button
            className="btn btn-primary"
            onClick={fetchRoles}
            disabled={loading} style={{ minWidth: 'fit-content' }}
          >
            <Icon icon="tabler:refresh" width={16} height={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <Icon icon="tabler:alert-triangle" width={20} height={20} className="me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Roles Display - Card Layout */}
      <div className="row g-3">
        {safeFilteredRoles.length === 0 && !loading ? (
          <div className="col-12">
            <div className="text-center py-5">
              <Icon icon="tabler:users-off" width={64} height={64} className="text-muted mb-3" />
              <h5 className="text-muted">No roles found</h5>
              {searchTerm && <p className="text-muted">Try a different search term</p>}
              <button className="btn btn-primary mt-3" onClick={handleCreateClick}>
                <Icon icon="tabler:plus" width={16} height={16} className="me-1" />
                Create First Role
              </button>
            </div>
          </div>
        ) : (
          safeFilteredRoles.map((role) => (
            <div className="col-md-6 col-lg-4" key={role.id}>
              <div className="card h-100 border">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                      <Icon icon="tabler:users" width={24} height={24} />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{role.name}</h5>
                      <p className="text-muted small mb-2">
                        <code className="text-dark">{role.slug}</code>
                      </p>
                      <p className="card-text text-muted small">
                        {role.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Permissions</span>
                      <span className="badge bg-primary rounded-pill">
                        {getPermissionCount(role)}
                      </span>
                    </div>
                    <div className="permissions-preview">
                      {role.permissions && role.permissions.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {role.permissions.map((perm, index) => (
                            <span key={perm.id} className="badge bg-light text-dark border">
                              {perm.name}
                            </span>
                          ))}
                          {/* {getPermissionCount(role) > 3 && (
                            <span className="badge bg-secondary">
                              +{getPermissionCount(role) - 3} more
                            </span>
                          )} */}
                        </div>
                      ) : (
                        <span className="text-muted small">No permissions assigned</span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Created: {formatDate(role.created_at)}
                      </small>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-primary"
                        title="Edit role"
                        onClick={() => handleEditClick(role)}
                      >
                        <Icon icon="tabler:pencil" width={14} height={14} />
                      </button>
                      <button
                        className="btn btn-danger"
                        title="Delete role"
                        onClick={() => handleDeleteClick(role)}
                      >
                        <Icon icon="tabler:trash" width={14} height={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Role Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} disabled={submitting}></button>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Role Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g., Super Admin"
                        value={currentRole.name}
                        onChange={handleNameChange}
                        disabled={submitting}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-0">
                        <label className="form-label">Slug *</label>
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="manualSlug"
                            checked={isSlugManual}
                            onChange={(e) => {
                              setIsSlugManual(e.target.checked);
                              if (!e.target.checked) {
                                setCurrentRole(prev => ({
                                  ...prev,
                                  slug: generateSlug(prev.name)
                                }));
                              }
                            }}
                          />
                          <label className="form-check-label small" htmlFor="manualSlug">
                            Manual
                          </label>
                        </div>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                        placeholder="e.g., super-admin"
                        value={currentRole.slug}
                        onChange={handleSlugChange}
                        disabled={submitting || !isSlugManual}
                      />
                      {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Describe the role's purpose..."
                        value={currentRole.description}
                        onChange={handleDescriptionChange}
                        disabled={submitting}
                        rows="2"
                      />
                    </div>

                    <div className="col-12">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Assign Permissions</h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={handleSelectAllPermissions}
                            >
                              <Icon icon="tabler:check" width={14} height={14} className="me-1" />
                              {currentRole.permission_ids.length === permissions.length ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          {permissionsLoading ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm text-primary"></div>
                              <span className="ms-2">Loading permissions...</span>
                            </div>
                          ) : Object.keys(groupedPermissions).length > 0 ? (
                            <div>
                              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                <div className='d-flex flex-wrap gap-2'>
                                  {categoryPermissions.map(permission => (
                                    <label className="form-check-label border rounded-3 px-3 py-2 d-flex gap-2" htmlFor={`perm-${permission.id}`} key={permission.id}>
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`perm-${permission.id}`}
                                        checked={currentRole.permission_ids.includes(permission.id)}
                                        onChange={() => handlePermissionToggle(permission.id)}
                                      />
                                      <div className="text-muted">
                                        {permission.name}
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Icon icon="tabler:lock-off" width={32} height={32} className="text-muted mb-2" />
                              <p className="text-muted mb-0">No permissions available</p>
                            </div>
                          )}
                          <div className="text-muted small mt-3">
                            <Icon icon="tabler:info-circle" width={14} height={14} className="me-1" />
                            Selected {currentRole.permission_ids.length} of {permissions.length} permissions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {modalMode === 'create' ? 'Creating...' : 'Saving...'}
                      </>
                    ) : (
                      modalMode === 'create' ? 'Create Role' : 'Save Changes'
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

export default Roles;