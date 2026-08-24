import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MasterLayout from "../../masterLayout/MasterLayout";

import "./plans.css";

const getTierName = (name) => {
    if (name === 'Weekly Plan' || name === 'Basic') return 'Basic';
    if (name === 'Monthly Plan' || name === 'Professional') return 'Professional';
    if (name === 'Quarterly Plan' || name === 'Premium') return 'Premium';
    return name || 'Basic';
};

const TIER_ORDER = { Basic: 1, Professional: 2, Premium: 3 };

const UpgradeSubscribePlan = () => {
    const userData = useSelector(state => state.user?.data);

    // Existing states
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribingPlan, setSubscribingPlan] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    // Fetch plans (existing)
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/billing/plans');
            const sorted = [...response.data].sort(
                (a, b) => (TIER_ORDER[getTierName(a.name)] || 99) - (TIER_ORDER[getTierName(b.name)] || 99)
            );
            setPlans(sorted);
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

    // Existing subscription handler (unchanged)
    const handleSubscribe = async (planId) => {
        if (userData?.plan_id === planId) {
            navigate('/upgrade-subscription');
            return;
        }

        try {
           setSubscribingPlan(planId);
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
             setSubscribingPlan(null);
        }
    };

    // Only an existing subscriber changing plans needs the proration warning.
    const confirmAndSubscribe = (planId) => {
        if (!userData?.plan_id) {
            handleSubscribe(planId);
            return;
        }

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
                handleSubscribe(planId);
            }
        });
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
        Basic: [
            'All Basic features',
            'Priority email & chat support',
            '50GB storage',
            'Unlimited projects',
            'Advanced analytics',
            'Custom branding'
        ],
        Professional: [
            'All Professional features',
            '24/7 phone support',
            '500GB storage',
            'Unlimited projects',
            'Advanced analytics & reporting',
            'Custom branding & white-label',
            'Dedicated account manager'
        ],
        Premium: [
            'All Professional features',
            '24/7 phone support',
            '500GB storage',
            'Unlimited projects',
            'Advanced analytics & reporting',
            'Custom branding & white-label'
        ]
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
            <div className="container py-0">
                <div className="plans-page-header">
                    <h1>Choose Your Plan</h1>
                    <p className="subtitle">Select the perfect tier for your needs and budget</p>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <div className="plans-tiers">
                    {plans.map((plan) => {
                        const tierName = getTierName(plan.name);
                        const tierFeatures = (plan.features && plan.features.length > 0)
                            ? plan.features
                            : (features[tierName] || []);

                        return (
                        <div key={plan.id} className="tier">

                            <div className="badge-wrapper">
                                {tierName === 'Professional' && (
                                    <span className="tier-badge">BEST VALUE</span>
                                )}
                                {userData?.plan_id === plan.id && (
                                    <span className="tier-badge">ACTIVE</span>
                                )}
                                {!plan.is_active && (
                                    <span className="tier-badge bg-secondary">INACTIVE</span>
                                )}
                            </div>

                            <div className="tier-name">
                                {tierName}
                            </div>

                            <div className="tier-price">${plan.price}</div>

                            <ul className="tier-features">
                                {tierFeatures.map((feature, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check text-success me-2"></i>
                                        <span className="feature-label">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="tier-btn"
                                onClick={() => confirmAndSubscribe(plan.id)}
                                disabled={userData?.plan_id === plan.id ||  subscribingPlan !== null  || !plan.is_active}
                            >
                                {subscribingPlan === plan.id ? (
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
                                    userData?.plan_id === plan.id ? 'Current Plan' : `Choose ${tierName}`
                                )}
                            </button>
                        </div>
                        );
                    })}
                </div>
            </div>

        </MasterLayout>
    );
};

export default UpgradeSubscribePlan;