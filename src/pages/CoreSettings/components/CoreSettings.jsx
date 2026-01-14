import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllCoreCredentials , deleteCoreCredential , updateOrCreateCoreCredential } from '../../../features/admin/core-settings-mangement/coreSettingsManagementSlice';
import { useDispatch } from 'react-redux';

const CoreSettings = () => {
    const dispatch = useDispatch();
    const { coreSettings, loading, error } = useSelector((state) => state.coreSettingsManagement);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSetting, setNewSetting] = useState({
        key: '',
        value: '',
        group: 'general',
        type: 'string',
        is_encrypted: 0
    });

    const fetchCoreCredentials = () => {
        dispatch(getAllCoreCredentials());
    };

    useEffect(() => {
        fetchCoreCredentials();
    }, []);

    // Group settings by group
    const groupedSettings = coreSettings?.reduce((acc, setting) => {
        const group = setting.group || 'general';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(setting);
        return acc;
    }, {}) || {};

    // Auto-expand first group
    useEffect(() => {
        if (Object.keys(groupedSettings).length > 0) {
            setExpandedGroups({ [Object.keys(groupedSettings)[0]]: true });
        }
    }, [coreSettings]);

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleEdit = (setting) => {
        setEditingId(setting.id);
        setEditValue(setting.is_encrypted && setting.value === '******' ? '' : setting.value);
    };

    const handleSave = async (setting) => {
        try {
            const formData = new FormData();
            formData.append('key', setting.key);
            formData.append('value', editValue);
            formData.append('group', setting.group);
            formData.append('type', setting.type);
            formData.append('is_encrypted', setting.is_encrypted ? '1' : '0');

            const result = await dispatch(updateOrCreateCoreCredential(formData));
            
            if (updateOrCreateCoreCredential.fulfilled.match(result)) {
                toast.success(`Updated ${setting.key}`);
                setEditingId(null);
                setEditValue('');
                fetchCoreCredentials(); // Refresh data
            } else {
                toast.error(`Failed to update ${setting.key}`);
            }
        } catch (error) {
            toast.error('Error updating setting');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleDelete = async (setting) => {
        if (window.confirm(`Are you sure you want to delete "${setting.key}"?`)) {
            try {
                const result = await dispatch(deleteCoreCredential(setting.key));
                
                if (deleteCoreCredential.fulfilled.match(result)) {
                    toast.success(`Deleted ${setting.key}`);
                    fetchCoreCredentials(); // Refresh data
                } else {
                    toast.error(`Failed to delete ${setting.key}`);
                }
            } catch (error) {
                toast.error('Error deleting setting');
            }
        }
    };

    const handleAddNew = () => {
        setNewSetting({
            key: '',
            value: '',
            group: 'general',
            type: 'string',
            is_encrypted: 0
        });
        setShowAddModal(true);
    };

    const handleSaveNew = async () => {
        try {
            const formData = new FormData();
            formData.append('key', newSetting.key);
            formData.append('value', newSetting.value);
            formData.append('group', newSetting.group);
            formData.append('type', newSetting.type);
            formData.append('is_encrypted', newSetting.is_encrypted ? '1' : '0');

            const result = await dispatch(updateOrCreateCoreCredential(formData));
            
            if (updateOrCreateCoreCredential.fulfilled.match(result)) {
                toast.success(`Added ${newSetting.key}`);
                setShowAddModal(false);
                fetchCoreCredentials(); // Refresh data
            } else {
                toast.error(`Failed to add ${newSetting.key}`);
            }
        } catch (error) {
            toast.error('Error adding setting');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const getGroupIcon = (group) => {
        const icons = {
            mail: 'tabler:mail',
            database: 'tabler:database',
            storage: 'tabler:cloud',
            api: 'tabler:api',
            cache: 'tabler:cache',
            queue: 'tabler:queue',
            general: 'tabler:settings'
        };
        return icons[group] || 'tabler:settings';
    };

    const getGroupTitle = (group) => {
        const titles = {
            mail: 'Mail Configuration',
            database: 'Database Settings',
            storage: 'Storage Configuration',
            api: 'API Settings',
            cache: 'Cache Configuration',
            queue: 'Queue Settings',
            general: 'General Settings'
        };
        return titles[group] || group.charAt(0).toUpperCase() + group.slice(1) + ' Settings';
    };

    if (loading && !coreSettings?.length) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading Core Settings...</span>
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
                    <h2 className="h4 mb-1">Core Settings</h2>
                    <p className="text-muted mb-0">Manage application configuration settings</p>
                </div>
                <div className="d-flex gap-2">
                    {/* <button
                        className="btn btn-success"
                        onClick={handleAddNew}
                        disabled={loading}
                    >
                        <Icon icon="tabler:plus" width={18} height={18} />
                        <span className="ms-2">Add Setting</span>
                    </button> */}
                    <button
                        className="btn btn-primary"
                        onClick={fetchCoreCredentials}
                        disabled={loading}
                    >
                        <Icon icon="tabler:refresh" width={18} height={18} className={loading ? 'spin' : ''} />
                        <span className="ms-2">Refresh</span>
                    </button>
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
                        onClick={() => {}}
                    ></button>
                </div>
            )}

            {/* Settings Groups */}
            <div className="row">
                {Object.entries(groupedSettings).map(([group, settings]) => (
                    <div key={group} className="col-12 mb-4">
                        <div className="card">
                            {/* Group Header */}
                            <div 
                                className="card-header bg-light cursor-pointer d-flex justify-content-between align-items-center"
                                onClick={() => toggleGroup(group)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex align-items-center">
                                    <Icon icon={getGroupIcon(group)} width={20} height={20} className="me-2" />
                                    <h5 className="mb-0">{getGroupTitle(group)}</h5>
                                    <span className="badge bg-secondary ms-2">{settings.length}</span>
                                </div>
                                <Icon 
                                    icon={expandedGroups[group] ? 'tabler:chevron-up' : 'tabler:chevron-down'} 
                                    width={20} height={20} 
                                />
                            </div>

                            {/* Group Content */}
                            {expandedGroups[group] && (
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4">Key</th>
                                                    <th>Value</th>
                                                    <th>Type</th>
                                                    <th>Encrypted</th>
                                                    <th>Last Updated</th>
                                                    <th className="pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {settings.map((setting) => (
                                                    <tr key={setting.id}>
                                                        <td className="ps-4">
                                                            <code className="text-muted">{setting.key}</code>
                                                        </td>
                                                        <td>
                                                            {editingId === setting.id ? (
                                                                <div className="d-flex gap-2">
                                                                    <input
                                                                        type={setting.is_encrypted ? 'password' : 'text'}
                                                                        className="form-control form-control-sm"
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        placeholder={setting.is_encrypted ? 'Enter new value' : ''}
                                                                    />
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => handleSave(setting)}
                                                                        title="Save"
                                                                    >
                                                                        <Icon icon="tabler:check" width={16} height={16} />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={handleCancel}
                                                                        title="Cancel"
                                                                    >
                                                                        <Icon icon="tabler:x" width={16} height={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex align-items-center">
                                                                    <span className={setting.is_encrypted ? 'text-muted fst-italic' : ''}>
                                                                        {setting.is_encrypted ? '******' : setting.value}
                                                                    </span>
                                                                    {setting.is_encrypted && (
                                                                        <Icon icon="tabler:lock" width={16} height={16} className="ms-2 text-warning" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-light text-dark">{setting.type}</span>
                                                        </td>
                                                        <td>
                                                            {setting.is_encrypted ? (
                                                                <span className="badge bg-warning-subtle text-warning">
                                                                    <Icon icon="tabler:lock" width={14} height={14} className="me-1" />
                                                                    Encrypted
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-success-subtle text-success">
                                                                    <Icon icon="tabler:lock-open" width={14} height={14} className="me-1" />
                                                                    Plain
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">{formatDate(setting.updated_at)}</small>
                                                        </td>
                                                        <td className="pe-4">
                                                            {editingId !== setting.id && (
                                                                <div className="d-flex gap-1">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleEdit(setting)}
                                                                        title="Edit setting"
                                                                    >
                                                                        <Icon icon="tabler:edit" width={16} height={16} />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDelete(setting)}
                                                                        title="Delete setting"
                                                                    >
                                                                        <Icon icon="tabler:trash" width={16} height={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && Object.keys(groupedSettings).length === 0 && (
                <div className="text-center py-5">
                    <Icon icon="tabler:settings-off" width={64} height={64} className="text-muted mb-3" />
                    <h5 className="text-muted">No Core Settings Found</h5>
                    <p className="text-muted">There are no core settings configured yet.</p>
                    <button className="btn btn-success" onClick={handleAddNew}>
                        <Icon icon="tabler:plus" width={18} height={18} className="me-2" />
                        Add First Setting
                    </button>
                </div>
            )}

            {/* Add New Setting Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Setting</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Key</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newSetting.key}
                                        onChange={(e) => setNewSetting({...newSetting, key: e.target.value})}
                                        placeholder="e.g., mail.default"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Value</label>
                                    <input
                                        type={newSetting.is_encrypted ? 'password' : 'text'}
                                        className="form-control"
                                        value={newSetting.value}
                                        onChange={(e) => setNewSetting({...newSetting, value: e.target.value})}
                                        placeholder="Setting value"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Group</label>
                                        <select
                                            className="form-select"
                                            value={newSetting.group}
                                            onChange={(e) => setNewSetting({...newSetting, group: e.target.value})}
                                        >
                                            <option value="general">General</option>
                                            <option value="mail">Mail</option>
                                            <option value="database">Database</option>
                                            <option value="storage">Storage</option>
                                            <option value="api">API</option>
                                            <option value="cache">Cache</option>
                                            <option value="queue">Queue</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            value={newSetting.type}
                                            onChange={(e) => setNewSetting({...newSetting, type: e.target.value})}
                                        >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="json">JSON</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_encrypted"
                                            checked={newSetting.is_encrypted}
                                            onChange={(e) => setNewSetting({...newSetting, is_encrypted: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="is_encrypted">
                                            Encrypt this value (for sensitive data like passwords)
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSaveNew}
                                    disabled={!newSetting.key || !newSetting.value || loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="tabler:plus" width={16} height={16} className="me-2" />
                                            Add Setting
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default CoreSettings;
