import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Icon } from "@iconify/react";
import axios from '../../../api/axios';
import { useNavigate } from 'react-router-dom';

import FormatDateTime from '../../../components/FormatDateTime';
import Avatar from '../../../components/Avatar'

const RecentSubscriptionsTable = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        cancelled: 0,
        revenue: 0
    });

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/dashboard/recent-subscriptions');
            const data = response.data.subscriptions || [];
            setSubscriptions(data);
            
            
            
            setStats({
                total: response.data.total_subscriptions,
                active: response.data.active_subscriptions,
                cancelled: response.data.cancelled_subscriptions,
                trial: response.data.trial_subscriptions,
            });
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: { 
                color: 'success', 
                bg: 'success-light', 
                icon: 'mdi:check-circle',
                text: 'Active'
            },
            cancelled: { 
                color: 'danger', 
                bg: 'danger-light', 
                icon: 'mdi:close-circle',
                text: 'Cancelled'
            },
            expired: { 
                color: 'warning', 
                bg: 'warning-light', 
                icon: 'mdi:alert-circle',
                text: 'Expired'
            },
            pending: { 
                color: 'info', 
                bg: 'info-light', 
                icon: 'mdi:clock',
                text: 'Pending'
            },
            trial: {
                color: 'primary',
                bg: 'primary-light',
                icon: 'mdi:timer-sand',
                text: 'Trial'
            }
        };
        
        return configs[status] || { 
            color: 'secondary', 
            bg: 'secondary-light', 
            icon: 'mdi:help-circle',
            text: status || 'Unknown'
        };
    };

    const getPlanColor = (planName) => {
        const colors = {
            'premium': 'primary',
            'pro': 'info',
            'basic': 'success',
            'enterprise': 'purple',
            'starter': 'warning'
        };
        
        return colors[planName?.toLowerCase()] || 'secondary';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="h-100">
            <Card.Body className="p-0">
                {/* Header with Stats */}
                <div className="pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="mb-1">Recent Subscriptions</h5>
                            <p className="text-muted mb-0">Latest subscription activities</p>
                        </div>
                        <button 
                            className="btn btn-sm btn-primary d-flex align-items-center"
                            onClick={fetchSubscriptions}
                            disabled={loading}
                        >
                            <Icon icon="mdi:refresh" className="me-1" />
                            Refresh
                        </button>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle p-2 me-3 avatar avatar-l  d-flex justify-contebt-center align-items-center">
                                        <Icon icon="mdi:account-group" className="text-white" width={24} height={20} />
                                    </div>
                                    <div>
                                        <h6 className="mb-0">{stats.total}</h6>
                                        <small className="text-muted">Total</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle p-2 me-3 avatar avatar-l  d-flex justify-contebt-center align-items-center">
                                        <Icon icon="mdi:check-circle" className="text-white" width={24} height={20} />
                                    </div>
                                    <div>
                                        <h6 className="mb-0">{stats.active}</h6>
                                        <small className="text-muted">Active</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle p-2 me-3 avatar avatar-l  d-flex justify-contebt-center align-items-center">
                                        <Icon icon="mdi:cancel" className="text-white" width={24} height={20} />
                                    </div>
                                    <div>
                                        <h6 className="mb-0">{stats.cancelled}</h6>
                                        <small className="text-muted">Cancelled</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="p-3 bg-light rounded">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle p-2 me-3 avatar avatar-l  d-flex justify-contebt-center align-items-center">
                                        <Icon icon="mdi:cash" className="text-white" width={24} height={20} />
                                    </div>
                                    <div>
                                        <h6 className="mb-0">{stats.trial}</h6>
                                        <small className="text-muted">Trial</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <small className="text-muted">Active Rate</small>
                            <small className="fw-medium">
                                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                            </small>
                        </div>
                        <ProgressBar 
                            now={stats.total > 0 ? (stats.active / stats.total) * 100 : 0} 
                            variant="primary"
                            style={{ height: '6px' }}
                            className='mb-0'
                        />
                    </div>
                </div>
                
                {/* Table Section */}
                <div className="pt-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted">Loading subscriptions...</p>
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <div className="text-center py-5">
                            <Icon 
                                icon="mdi:file-document-outline" 
                                className="text-muted mb-3" 
                                style={{ fontSize: '3rem', opacity: 0.5 }}
                            />
                            <h6 className="text-muted">No subscriptions found</h6>
                            <p className="text-muted small">New subscriptions will appear here</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th className="ps-0">Customer</th>
                                        <th>Plan</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th className="text-end pe-0">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((subscription) => {
                                        const statusConfig = getStatusConfig(subscription.status);
                                        const planColor = getPlanColor(subscription.plan?.name);
                                        
                                        return (
                                            <tr key={subscription.id} className="align-middle">
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center">
                                                        <div className={`avatar avatar-sm bg-${planColor}-subtle text-${planColor} rounded-circle d-flex align-items-center justify-content-center me-3`}>
                                                            <Avatar name={subscription.user?.name} />
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium text-truncate">
                                                                {subscription.user?.name || 'Unknown User'}
                                                            </div>
                                                            <small className="text-muted text-truncate d-block">
                                                                {subscription.user?.email || 'N/A'}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${planColor}-subtle text-${planColor} px-3 py-1`}>
                                                        {subscription.name || 'Default Plan'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="fw-medium">
                                                        {formatCurrency(subscription.plan?.price)}
                                                    </span>
                                                    <small className="text-muted d-block">
                                                        {subscription.billing_cycle || 'Monthly'}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${statusConfig.bg} text-${statusConfig.color} d-inline-flex align-items-center px-3 py-1`}>
                                                        <Icon icon={statusConfig.icon} className="me-1" />
                                                        {statusConfig.text}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-0">
                                                    <div className="text-muted">
                                                        <small><FormatDateTime dateString={subscription.created_at} time={false} /></small>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Footer */}
                    {subscriptions.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                            <small className="text-muted">
                                Showing {Math.min(subscriptions.length, 5)} of {stats.total} subscriptions
                            </small>
                            <button className="btn btn-sm btn-primary text-decoration-none" onClick={()=>{navigate('/billing/subscriptions')}}>
                                View All
                                <Icon icon="mdi:chevron-right" className="ms-1" />
                            </button>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default RecentSubscriptionsTable;