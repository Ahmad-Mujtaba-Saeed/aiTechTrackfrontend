import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllSubscriptions } from '../../../features/admin/subscription-management/subscriptionManagementSlice';
import { useDispatch } from 'react-redux';

const Subscriptions = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, error, subscriptions, uniqueStatuses } = useSelector((state) => state.subscriptionManagement);

    const fetchSubscriptions = (page = 1, search = '', status = '') => {
        dispatch(getAllSubscriptions({ page, search, status }));
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSubscriptions(1, searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter]);

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

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            canceled: 'danger',
            trialing: 'info',
            incomplete: 'warning',
            past_due: 'warning',
            unpaid: 'danger'
        };
        const variant = variants[status] || 'secondary';
        return (
            <span className={`badge bg-${variant}-subtle text-${variant}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
            </span>
        );
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= subscriptions?.last_page && page !== subscriptions?.current_page) {
            setCurrentPage(page);
            fetchSubscriptions(page, searchTerm, statusFilter);
        }
    };

    if (loading && !subscriptions?.data) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading Subscriptions...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">
            <div className="d-md-flex justify-content-between align-items-center mb-4">
                
            </div>

            <div className="card mb-4 ">
                <div className="card-body p-3 ">
                    <div className="row align-items-center">
                        <div className="col-md-12 mb-3 mb-md-0 d-flex gap-2  ">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Icon icon="tabler:search" width={18} height={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search by subscription ID, customer ID, user name or email..."
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
                            <select
                                className="form-select"
                                style={{ maxWidth: '200px' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                {uniqueStatuses?.map((status) => (
                                    <option key={status} value={status}>
                                        {status?.charAt(0).toUpperCase() + status?.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => fetchSubscriptions(1, searchTerm, statusFilter)}
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
                                    <th>User</th>
                                    <th>Subscription ID</th>
                                    <th>Customer ID</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Period</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions?.data?.map((subscription) => (
                                    <tr key={subscription.id}>
                                        <td className="ps-4">
                                            <span className="badge bg-light text-dark">#{subscription.id}</span>
                                        </td>
                                        <td>
                                            {subscription.user ? (
                                                <div>
                                                    <div className="fw-semibold">{subscription.user.name}</div>
                                                    <small className="text-muted">{subscription.user.email}</small>
                                                </div>
                                            ) : (
                                                <span className="text-muted">User ID: #{subscription.user_id}</span>
                                            )}
                                        </td>
                                        <td>
                                            <code className="text-muted">{subscription.sub_id || 'N/A'}</code>
                                        </td>
                                        <td>
                                            <code className="text-muted">{subscription.cus_id || 'N/A'}</code>
                                        </td>
                                        <td>
                                            {subscription.plan ? (
                                                <div>
                                                    <div className="fw-semibold">{subscription.plan.name}</div>
                                                    <small className="text-muted">${subscription.plan.price}/{subscription.plan.interval}</small>
                                                </div>
                                            ) : (
                                                <span className="text-muted">{subscription.name || 'N/A'}</span>
                                            )}
                                        </td>
                                        <td>
                                            {getStatusBadge(subscription.status)}
                                        </td>
                                        <td>
                                            <span className="fw-semibold">
                                                {subscription.plan ? `$${subscription.plan.price}` : 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {subscription.ends_at ? `Ends: ${formatDate(subscription.ends_at)}` : 
                                                 subscription.trial_ends_at ? `Trial: ${formatDate(subscription.trial_ends_at)}` : 
                                                 'Ongoing'}
                                            </small>
                                        </td>
                                        <td>
                                            <small className="text-muted">{formatDate(subscription.created_at)}</small>
                                        </td>
                                    </tr>
                                ))}
                                {(!subscriptions?.data || subscriptions.data.length === 0) && !loading && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            <Icon icon="tabler:subscription-off" width={48} height={48} className="text-muted mb-2" />
                                            <p className="text-muted mb-0">No subscriptions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {subscriptions?.last_page > 1 && (
                    <div className="card-footer border-top">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div className="mb-2 mb-md-0">
                                <small className="text-muted">
                                    Showing {subscriptions.from || 0} to {subscriptions.to || 0} of {subscriptions.total || 0} entries
                                </small>
                            </div>
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${subscriptions.current_page === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(subscriptions.current_page - 1)}
                                            disabled={subscriptions.current_page === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {subscriptions.current_page > 2 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                        </li>
                                    )}

                                    {subscriptions.current_page > 3 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}

                                    {subscriptions.current_page > 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(subscriptions.current_page - 1)}
                                            >
                                                {subscriptions.current_page - 1}
                                            </button>
                                        </li>
                                    )}

                                    <li className="page-item active">
                                        <span className="page-link">{subscriptions.current_page}</span>
                                    </li>

                                    {subscriptions.current_page < subscriptions.last_page && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(subscriptions.current_page + 1)}
                                            >
                                                {subscriptions.current_page + 1}
                                            </button>
                                        </li>
                                    )}

                                    {subscriptions.current_page < subscriptions.last_page - 2 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}

                                    {subscriptions.current_page < subscriptions.last_page - 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(subscriptions.last_page)}
                                            >
                                                {subscriptions.last_page}
                                            </button>
                                        </li>
                                    )}

                                    <li className={`page-item ${subscriptions.current_page === subscriptions.last_page ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(subscriptions.current_page + 1)}
                                            disabled={subscriptions.current_page === subscriptions.last_page}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Subscriptions;