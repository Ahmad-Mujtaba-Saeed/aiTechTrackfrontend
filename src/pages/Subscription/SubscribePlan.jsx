import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import logo from "../../assets/images/logo.png";
import Swal from "sweetalert2";
import "./plans.css";

const getTierName = (name) => {
    if (name === 'Weekly Plan' || name === 'Basic') return 'Basic';
    if (name === 'Monthly Plan' || name === 'Professional') return 'Professional';
    if (name === 'Quarterly Plan' || name === 'Premium') return 'Premium';
    return name || 'Basic';
};

const TIER_ORDER = { Basic: 1, Professional: 2, Premium: 3 };

const SubscribePlan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [subscribing, setSubscribing] = useState(false);
    const userData = useSelector((state) => state.user.data);


    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                console.log('Fetching plans from /plans...');
                const response = await axios.get('/billing/plans');
                console.log('Plans API response:', response);
                if (response.data && Array.isArray(response.data)) {
                    const sorted = [...response.data].sort(
                        (a, b) => (TIER_ORDER[getTierName(a.name)] || 99) - (TIER_ORDER[getTierName(b.name)] || 99)
                    );
                    setPlans(sorted);
                } else {
                    console.error('Invalid plans data format:', response.data);
                    setError('Invalid data received from server');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError('Failed to load subscription plans. Please try again later.');
                setLoading(false);
            }
        };

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

    const handleSubscribe = (planId) => {
        axios.get(`/billing/stripe/create-subscription-session/${planId}?isFreeTrial=true`)
            .then(response => {
                window.location.href = response.data.checkoutUrl;
            })
            .catch(error => {
                console.error('Error creating subscription session:', error);
                setError('Failed to initiate subscription. Please try again.');
            });
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status" className="mb-3">
                    <span className="visually-hidden">Loading plans...</span>
                </Spinner>
                <p>Loading available plans...</p>
            </Container>
        );
    }


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
    }


    return (
        <>
            <Container className="py-5" style={{ maxWidth: "1200px", marginTop: "40px" }}>
                <Row className="text-center mb-5">
                    <Col>
                        <img src={logo} style={{ width: "120px", marginBottom: "10px" }} />
                        <h1 className="display-2 fw-bold">{userData?.plan_id ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h1>
                        <p className="lead text-muted">Select the perfect plan for your needs</p>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Row className="justify-content-center g-3 d-none" style={{ marginTop: "100px" }}>
                    {plans.map((plan) => (
                        <Col key={plan.id} md={6} lg={4} className="mb-4">
                            <Card
                                className={`h-100 shadow-sm ${plan.interval === 'monthly' ? ' border border-primary' : ''}`}
                            >

                                {plan.interval === 'monthly' && (
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <Badge bg="primary">Popular</Badge>
                                    </div>
                                )}
                                {userData?.plan_id === plan.id && (
                                    <div className="position-absolute top-0 start-0 m-2">
                                        <Badge bg="primary">Currently Active</Badge>
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column pt-5">
                                    <Card.Title className={`text-center mb-4 mt-2`}>
                                        <h3 className="h4">{plan?.title}</h3>
                                        <div className="display-4 fw-bold my-3">
                                            £{plan.price}
                                            <small className="text-muted fw-normal fs-6">
                                                {getIntervalText(plan.interval)}
                                            </small>
                                        </div>
                                    </Card.Title>
                                    <Card.Text className="mb-4">
                                        {plan.subdesc}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <Button
                                            variant={plan.interval === 'monthly' ? 'primary' : 'outline-primary'}
                                            className="w-100"
                                            onClick={() => {
                                                handleSubscribe(plan.id); // ✅ proceed only if confirmed
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
                                                'Choose Plan'
                                            )}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="plans-tiers">
                    {plans.map((plan) => {
                        const tierName = getTierName(plan.name);
                        const tierFeatures = features[tierName] || [];

                        return (
                        <div key={plan.id} className="tier">
                            <div className="badge-wrapper">
                                {tierName === 'Professional' && (
                                    <span className="tier-badge">
                                        BEST VALUE
                                    </span>
                                )}
                                {userData?.plan_id === plan.id && (
                                    <span className="tier-badge">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                            <div className="tier-name">
                                {tierName}
                            </div>
                            <div className="tier-price">${plan.price}</div>
                            <div className="tier-period">
                                {tierName}
                            </div>

                            <ul className="tier-features">
                                {tierFeatures.map((feature, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check text-success me-2"></i>
                                        <span className="feature-label">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="tier-btn"
                                onClick={() => confirmAndSubscribe(plan.id)}
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
                                    `Choose ${tierName}`
                                )}
                            </button>
                        </div>
                        );
                    })}

                </div>
            </Container>
        </>
    );
}

export default SubscribePlan;
