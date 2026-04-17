import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/MPF-logo.svg";
import Swal from "sweetalert2";

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
                    setPlans(response.data);
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


    return (
        <>
            <Container className="py-5" style={{ maxWidth: "1200px", marginTop: "40px" }}>
                <Row className="text-center mb-5">
                    <Col>
                        <img src={logo} style={{ width: "120px", marginBottom: "10px" }} />
                        <h1 className="display-4 fw-bold">{userData?.plan_id ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h1>
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
                                            handleSubscribe(plan.id);
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
            </Container>
        </>
    );
}

export default SubscribePlan;