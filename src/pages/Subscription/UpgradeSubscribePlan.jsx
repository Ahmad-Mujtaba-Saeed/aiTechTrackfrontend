import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import MasterLayout from "../../masterLayout/MasterLayout";

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
            const response = await axios.get('/api/plans');
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
            await axios.post(`/api/subscription/change-plan/${planId}`);

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

    return (
        <MasterLayout>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col>
                        <h1 className="display-4 fw-bold">{userData?.plan_id ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h1>
                        <p className="lead text-muted">Select the perfect plan for your needs</p>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <Row className="justify-content-center g-3">
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
                                    {/* <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="mb-2">
                                            <i className="fas fa-check text-success me-2"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul> */}
                                    <div className="mt-auto">
                                        <Button
                                            variant={plan.interval === 'monthly' ? 'primary' : 'outline-primary'}
                                            className="w-100"
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
                                                'Choose Plan'
                                            )}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </MasterLayout>
    );
};

export default UpgradeSubscribePlan;