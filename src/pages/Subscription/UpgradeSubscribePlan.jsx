import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MasterLayout from "../../masterLayout/MasterLayout";

import "./plans.css";
const UpgradeSubscribePlan = () => {
    const userData = useSelector(state => state.user?.data);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false); // New state for subscription loading
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
    const handleSubscribe = async (planId) => {
        if (userData?.plan_id === planId) {
            navigate('/upgrade-subscription');
            return;
        }

        try {
            setSubscribing(true);
            setError('');
            await axios.post(`/billing/subscription/change-plan/${planId}`);

            // Show success message with SweetAlert2
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
            // Show error with SweetAlert2
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
    }

    const badges = {
        monthly: 'Save 25%',
        quaterly: 'Save 67%'
    }

    console.table(plans)

    return (
        <MasterLayout>
            <div className="container py-5">
                <div className="header">
                    <h1>Choose Your Plan</h1>
                    <p className="subtitle">Select the perfect tier for your needs and budget</p>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <div className="plans-tiers">
                    {plans.map((plan) => (
                        <div className={`tier ${plan.name === 'Monthly Plan' && 'professional'}`}>
                            <div className="badge-wrapper">
                                {plan.name === 'Monthly Plan' && (
                                    <span className="tier-badge">
                                        RECOMMENDED
                                    </span>
                                )}
                                {userData?.plan_id === plan.id && (
                                    <span className="tier-badge">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                            <div className="tier-name">
                                {plan.name === 'Weekly Plan' ? 'Basic' : plan.name === 'Monthly Plan' ? 'Professional' : plan.name === 'Quarterly Plan' ? 'Premium' : 'Basic'}
                            </div>
                            <div className="tier-price"> ${plan.price}</div>
                            <div className="tier-period">
                                {plan.name}
                                {plan.name === 'Weekly Plan' ? ('') : plan.name === 'Monthly Plan' ? (
                                    badges.monthly && (
                                        <span className="savings-badge">{badges.monthly}</span>
                                    )
                                ) : plan.name === 'Quarterly Plan' && (
                                    badges.quaterly && (
                                        <span className="savings-badge">{badges.quaterly}</span>
                                    )
                                )}
                            </div>

                            <ul className="tier-features">
                                {plan.name === 'Weekly Plan' ? (
                                    features?.weekly.map((feature, index) => (
                                        <li key={index}>
                                            <span className="feature-label">{feature}</span>
                                        </li>
                                    ))
                                ) : plan.name === 'Monthly Plan' ? (
                                    features?.monthly.map((feature, index) => (
                                        <li key={index}>
                                            <span className="feature-label">{feature}</span>
                                        </li>
                                    ))
                                ) : plan.name === 'Quarterly Plan' && (
                                    features?.quaterly.map((feature, index) => (
                                        <li key={index}>
                                            <span className="feature-label">{feature}</span>
                                        </li>
                                    ))
                                )}
                            </ul>

                            <button className="tier-btn"
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
                                            handleSubscribe(plan.id); // ✅ proceed only if confirmed
                                        }
                                    });
                                }}
                                disabled={userData?.plan_id === plan.id || subscribing}
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
                                    `Choose ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}

                </div>
            </div>

        </MasterLayout>
    );
};

export default UpgradeSubscribePlan;