import React , {useEffect,useState} from "react";
import axios from "../../api/axios";
import { useDispatch,useSelector } from "react-redux";
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/MPF-logo.svg";
import Swal from "sweetalert2";

const SubscribePlan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [subscribing, setSubscribing] = useState(false); // New state for subscription loading
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


    return(
        <>
        <Container className="py-5"  style={{maxWidth:"1200px" , marginTop:"40px"}}>
            <Row className="text-center mb-5">
                <Col>
                <img src={logo} style={{width:"120px" , marginBottom:"10px"}}/>
                
                    <h1 className="display-4 fw-bold">{userData?.plan_id ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h1>
                    <p className="lead text-muted">Select the perfect plan for your needs</p>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

                <Row className="justify-content-center g-3 " style={{marginTop:"100px"}}>
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
        </Container>
        </>
    );
}

export default SubscribePlan;