import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllPlans } from '../../../features/admin/plan-management/PlanManagementSlice';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from '../../../api/axios';
import BreadCrum from "../../../components/BreadCrum";
const PlanSettings = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { loading, error, plans } = useSelector((state) => state.planManagement);
    
    // Modal and form states
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        currency: 'USD',
        interval: 'month',
        interval_count: '1',
        subdesc: '',
        features: ['']
    });

    const fetchPlans = (search = '') => {
        dispatch(getAllPlans({ search }));
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPlans(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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

    // Open modal for creating new plan
    const handleCreateNew = () => {
        setEditingPlan(null);
        setFormData({
            name: '',
            price: '',
            currency: 'USD',
            interval: 'month',
            interval_count: '1',
            subdesc: '',
            features: ['']
        });
        setShowModal(true);
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            currency: plan.currency || 'USD',
            interval: plan.interval || 'month',
            interval_count: plan.interval_count?.toString() || '1',
            subdesc: plan.subdesc || '',
            features: plan.features?.length > 0 ? [...plan.features] : ['']
        });
        setShowModal(true);
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle feature input changes
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    // Add new feature field
    const addFeatureField = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    // Remove feature field
    const removeFeatureField = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                features: newFeatures
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim() || !formData.price) {
            Swal.fire('Error', 'Please fill in required fields', 'error');
            return;
        }

        try {
            setModalLoading(true);
            
            // Prepare form data
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('currency', formData.currency);
            data.append('interval', formData.interval);
            data.append('interval_count', formData.interval_count);
            data.append('subdesc', formData.subdesc);
            
            // Add features (filter out empty ones)
            const validFeatures = formData.features.filter(f => f.trim() !== '');
            validFeatures.forEach(feature => {
                data.append('features[]', feature);
            });

            if (editingPlan) {
                // Update existing plan
                data.append('_method', 'PUT');
                await axios.post(`/admin/billing/plans/${editingPlan.id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                Swal.fire('Success', 'Plan updated successfully', 'success');
            } else {
                // Create new plan
                await axios.post('/admin/billing/plans', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                Swal.fire('Success', 'Plan created successfully', 'success');
            }
            
            // Refresh plans and close modal
            fetchPlans();
            setShowModal(false);
            
        } catch (error) {
            console.error('Error saving plan:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to save plan', 'error');
        } finally {
            setModalLoading(false);
        }
    };

    // Toggle plan active status
    const handleToggleActive = async (plan) => {
        try {
            await axios.patch(`/admin/billing/plans/${plan.id}/toggle-active`);
            Swal.fire('Success', 'Plan status updated', 'success');
            fetchPlans();
        } catch (error) {
            Swal.fire('Error', 'Failed to update plan status', 'error');
        }
    };

    if (loading && !plans) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading plans...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 ">
            <div className="d-flex justify-content-between align-items-center mb-4">
             
    <BreadCrum title="Plan Management" subTitle="Manage your pricing plans" />

    <Button
        variant="success"
        onClick={handleCreateNew}
        className="btn-sm border border-2 border-dark"
    >
        <Icon icon="tabler:plus" width={18} height={18} className="me-2" />
        Create New Plan
    </Button>
</div>
             
            

            <div className="card mb-4">
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
                                    placeholder="Search by plan name or description..."
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
                                onClick={() => fetchPlans(searchTerm, statusFilter)}
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

            <div className="card mb-4 overflow-hidden">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Plan Name</th>
                                    <th>Price</th>
                                    <th>Interval</th>
                                    <th>Features</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans?.map((plan) => (
                                    <tr key={plan.id}>
                                        <td className="ps-4">
                                            <span className="badge bg-light text-dark">#{plan.id}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="fw-semibold">{plan.name}</div>
                                                <small className="text-muted">{plan.subdesc}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-semibold">
                                                {plan.price} {plan.currency}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                Every {plan.interval_count} {plan.interval}{plan.interval_count > 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="small">
                                                {plan.features?.slice(0, 2).map((feature, index) => (
                                                    <div key={index} className="text-muted">
                                                        • {feature}
                                                    </div>
                                                ))}
                                                {plan.features?.length > 2 && (
                                                    <div className="text-muted">+{plan.features.length - 2} more</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                          <span className={`badge ${plan.is_active ? 'bg-success' : 'bg-light'} text-dark`}>
    {plan.is_active ? 'Active' : 'Inactive'}
</span>
                                        </td>
                                        <td>
                                            <small className="text-muted">{formatDate(plan.created_at)}</small>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleEditPlan(plan)}
                                                    title="Edit Plan"
                                                >
                                                    <Icon icon="tabler:edit" width={16} height={16} />
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${plan.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                    onClick={() => handleToggleActive(plan)}
                                                    title={plan.is_active ? 'Deactivate Plan' : 'Activate Plan'}
                                                >
                                                    <Icon icon={plan.is_active ? 'tabler:toggle-left' : 'tabler:toggle-right'} width={16} height={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!plans || plans.length === 0) && !loading && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            <Icon
                        icon="tabler:receipt-off"
                        width={48}
                        height={48}
                        className="text-muted mb-2"
                    />
                                            <p className="text-muted mb-0">No plans found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Plan Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Plan Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Monthly Pro"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Price ($) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 19.99"
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Currency</Form.Label>
                                    <Form.Select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Billing Interval</Form.Label>
                                    <Form.Select
                                        name="interval"
                                        value={formData.interval}
                                        onChange={handleInputChange}
                                    >
                                        <option value="day">Daily</option>
                                        <option value="week">Weekly</option>
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="subdesc"
                                value={formData.subdesc}
                                onChange={handleInputChange}
                                placeholder="Plan description for users"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <Form.Label>Features *</Form.Label>
                                <Button 
                                    type="button" 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={addFeatureField}
                                >
                                    <Icon icon="tabler:plus" width={16} height={16} className="me-1" /> Add Feature
                                </Button>
                            </div>
                            {formData.features.map((feature, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Feature ${index + 1} (e.g., 24/7 Support)`}
                                        className="me-2"
                                    />
                                    {formData.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeFeatureField(index)}
                                        >
                                            <Icon icon="tabler:x" width={16} height={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={modalLoading}>
                            {modalLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Saving...
                                </>
                            ) : (
                                editingPlan ? 'Update Plan' : 'Create Plan'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </div>
    )
}

export default PlanSettings;