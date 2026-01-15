import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MasterLayout from "../../masterLayout/MasterLayout";
import { hasPermission } from '../../utils/permissions';

import "./plans.css";

const UpgradeSubscribePlan = () => {
    const userData = useSelector(state => state.user?.data);
    const hasPermissionManagePlan = () => hasPermission(userData, 'manage-plans');
    
    // Existing states
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // New states for admin functionality
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
        features: [''] // Start with one empty feature
    });

    // Fetch plans (existing)
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/billing/plans');
            setPlans(response.data);
        } catch (err) {
            setError('Failed to load subscription plans. Please try again later.');
            console.error('Error fetching plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

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

    // Open modal for editing existing plan
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

    // Submit form (create or update)
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

    // Delete plan
    const handleDeletePlan = async (planId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete this subscription plan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/admin/billing/plans/${planId}`);
                Swal.fire('Deleted!', 'Plan has been deleted.', 'success');
                fetchPlans(); // Refresh list
            } catch (error) {
                Swal.fire('Error', 'Failed to delete plan', 'error');
            }
        }
    };

    // Toggle plan active status
    const handleToggleActive = async (plan) => {
        try {
            await axios.patch(`/admin/billing/plans/${plan.id}/toggle-active`);
            Swal.fire('Success', 'Plan status updated', 'success');
            fetchPlans(); // Refresh list
        } catch (error) {
            Swal.fire('Error', 'Failed to update plan status', 'error');
        }
    };

    // Existing subscription handler (unchanged)
    const handleSubscribe = async (planId) => {
        if (userData?.plan_id === planId) {
            navigate('/upgrade-subscription');
            return;
        }

        try {
            setSubscribing(true);
            setError('');
            await axios.post(`/billing/subscription/change-plan/${planId}`);

            await Swal.fire({
                title: 'Processing Your Request',
                text: 'Your subscription update is being processed. This may take a minute or two to complete.',
                icon: 'info',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                willClose: () => {
                    window.location.reload();
                }
            });

        } catch (error) {
            console.error('Error updating subscription:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Failed to update subscription. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setSubscribing(false);
        }
    };

    const getIntervalText = (interval) => {
        switch (interval) {
            case 'monthly': return '/month';
            case 'quarterly': return '/quarter';
            case 'yearly': return '/year';
            case 'weekly': return '/week';
            case 'daily': return '/day';
            default: return '';
        }
    };

    const features = {
        weekly: [
            'Access to basic features',
            'Email support',
            '5GB storage',
            'Up to 3 projects'
        ],
        monthly: [
            'All Basic features',
            'Priority email & chat support',
            '50GB storage',
            'Unlimited projects',
            'Advanced analytics',
            'Custom branding'
        ],
        quaterly: [
            'All Professional features',
            '24/7 phone support',
            '500GB storage',
            'Unlimited projects',
            'Advanced analytics & reporting',
            'Custom branding & white-label',
            'Dedicated account manager'
        ]
    };

    const badges = {
        monthly: 'Save 25%',
        quaterly: 'Save 67%'
    };

    if (loading) {
        return (
            <MasterLayout>
                <Container className="py-5 text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading plans...</span>
                    </Spinner>
                    <p>Loading available plans...</p>
                </Container>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <div className="container py-5">
                <div className="header">
                    <h1>Choose Your Plan</h1>
                    <p className="subtitle">Select the perfect tier for your needs and budget</p>
                    
                    {/* Admin controls */}
                    {hasPermissionManagePlan() && (
                        <div className="admin-controls mb-4">
                            <Button 
                                variant="success" 
                                onClick={handleCreateNew}
                                className="me-2"
                            >
                                <i className="fas fa-plus me-2"></i>Create New Plan
                            </Button>
                            <small className="text-muted">
                                Admin: You can create, edit, and manage subscription plans
                            </small>
                        </div>
                    )}
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <div className="plans-tiers">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`tier ${plan.name === 'Monthly Plan' && 'professional'}`}>
                            {/* Admin actions - only visible to admins */}
                            {hasPermissionManagePlan() && (
                                <div className="admin-actions mb-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline-primary" 
                                        onClick={() => handleEditPlan(plan)}
                                        className="me-2"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant={plan.is_active ? "outline-warning" : "outline-success"}
                                        onClick={() => handleToggleActive(plan)}
                                        className="me-2"
                                    >
                                        <i className={plan.is_active ? "fas fa-toggle-on" : "fas fa-toggle-off"}></i>
                                    </Button>
                                </div>
                            )}
                            
                            <div className="badge-wrapper">
                                {plan.name === 'Monthly Plan' && (
                                    <span className="tier-badge">RECOMMENDED</span>
                                )}
                                {userData?.plan_id === plan.id && (
                                    <span className="tier-badge">ACTIVE</span>
                                )}
                                {!plan.is_active && (
                                    <span className="tier-badge bg-secondary">INACTIVE</span>
                                )}
                            </div>
                            
                            <div className="tier-name">
                                {plan.name === 'Weekly Plan' ? 'Basic' : 
                                 plan.name === 'Monthly Plan' ? 'Professional' : 
                                 plan.name === 'Quarterly Plan' ? 'Premium' : 
                                 plan.name}
                            </div>
                            
                            <div className="tier-price">${plan.price}</div>
                            <div className="tier-period">
                                {plan.name}
                                {plan.name === 'Weekly Plan' ? ('') : 
                                 plan.name === 'Monthly Plan' ? (
                                    badges.monthly && (
                                        <span className="savings-badge">{badges.monthly}</span>
                                    )
                                ) : plan.name === 'Quarterly Plan' && (
                                    badges.quaterly && (
                                        <span className="savings-badge">{badges.quaterly}</span>
                                    )
                                )}
                            </div>

                            {/* Show actual plan features from API */}
                            <ul className="tier-features">
                                {plan.features && plan.features.length > 0 ? (
                                    plan.features.map((feature, index) => (
                                        <li key={index}>
                                            <i className="fas fa-check text-success me-2"></i>
                                            <span className="feature-label">{feature}</span>
                                        </li>
                                    ))
                                ) : (
                                    // Fallback to hardcoded features if API doesn't provide
                                    (plan.name === 'Weekly Plan' ? features.weekly :
                                     plan.name === 'Monthly Plan' ? features.monthly :
                                     plan.name === 'Quarterly Plan' ? features.quaterly : []).map((feature, index) => (
                                        <li key={index}>
                                            <i className="fas fa-check text-success me-2"></i>
                                            <span className="feature-label">{feature}</span>
                                        </li>
                                    ))
                                )}
                            </ul>

                            <button 
                                className="tier-btn"
                                onClick={() => {
                                    Swal.fire({
                                        title: "Confirm Plan Change",
                                        html: `
                                            Changing your subscription may result in additional charges or credits.<br>
                                            Stripe will automatically adjust your next billing cycle based on usage and time left in current plan.<br><br>
                                            <strong>Do you want to continue?</strong>
                                        `,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, proceed",
                                        cancelButtonText: "Cancel",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleSubscribe(plan.id);
                                        }
                                    });
                                }}
                                disabled={userData?.plan_id === plan.id || subscribing || !plan.is_active}
                            >
                                {subscribing ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    userData?.plan_id === plan.id ? 'Current Plan' : `Choose ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}
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
                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
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
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
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
                            </Col>
                        </Row>
                        
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
                                    <i className="fas fa-plus me-1"></i> Add Feature
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
                                            onClick={() => removeFeatureField(index)}
                                        >
                                            <i className="fas fa-times"></i>
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
        </MasterLayout>
    );
};

export default UpgradeSubscribePlan;