import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllTransactions } from '../../../features/admin/transaction-management/transactionManagementSlice';
import { useDispatch } from 'react-redux';

const Transactions = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, error, transactions, payment_status } = useSelector((state) => state.transactionManagement);

    const fetchTransactions = (page = 1, search = '', paymentStatus = '') => {
        dispatch(getAllTransactions({ page, search, payment_status: paymentStatus }));
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions(1, searchTerm, paymentStatusFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, paymentStatusFilter]);

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
            paid: 'success',
            pending: 'warning',
            failed: 'danger',
            refunded: 'info'
        };
        const variant = variants[status] || 'secondary';
        return (
            <span className={`badge bg-${variant}-subtle text-${variant}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
            </span>
        );
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= transactions?.last_page && page !== transactions?.current_page) {
            setCurrentPage(page);
            fetchTransactions(page, searchTerm, paymentStatusFilter);
        }
    };

    if (loading && !transactions?.data) {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading Transactions...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">
            {/* Existing header - NO CHANGES */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 mb-1">Transactions</h2>
                    <p className="text-muted mb-0">Manage payment transactions</p>
                </div>
            </div>

            <div className="card mb-4 border">
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
                                    placeholder="Search by Transaction ID..."
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
                                value={paymentStatusFilter}
                                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                {payment_status?.map((status) => (
                                    <option key={status} value={status}>
                                        {status?.charAt(0).toUpperCase() + status?.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => fetchTransactions(1, searchTerm, paymentStatusFilter)}
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

            <div className="card mb-4 overflow-hidden border">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Transaction ID</th>
                                    <th>User ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Gateway</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions?.data?.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="ps-4">
                                            <span className="badge bg-light text-dark">#{transaction.id}</span>
                                        </td>
                                        <td>
                                            <code className="text-muted">{transaction.payment_transaction_id || 'N/A'}</code>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary">#{transaction.user_id}</span>
                                        </td>
                                        <td>
                                            <small className="text-muted">{transaction.related_type || 'N/A'}</small>
                                        </td>
                                        <td>
                                            <span className="fw-semibold">
                                                {transaction.payment_amount ? `${transaction.payment_amount} ${transaction.payment_currency || 'USD'}` : 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            {getStatusBadge(transaction.payment_status)}
                                        </td>
                                        <td>
                                            <small className="text-muted">{transaction.payment_gateway || 'N/A'}</small>
                                        </td>
                                        <td>
                                            <small className="text-muted">{formatDate(transaction.created_at)}</small>
                                        </td>
                                    </tr>
                                ))}
                                {(!transactions?.data || transactions.data.length === 0) && !loading && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            <Icon icon="tabler:receipt-off" width={48} height={48} className="text-muted mb-2" />
                                            <p className="text-muted mb-0">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {transactions?.last_page > 1 && (
                    <div className="card-footer border-top">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div className="mb-2 mb-md-0">
                                <small className="text-muted">
                                    Showing {transactions.from || 0} to {transactions.to || 0} of {transactions.total || 0} entries
                                </small>
                            </div>
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${transactions.current_page === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(transactions.current_page - 1)}
                                            disabled={transactions.current_page === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {transactions.current_page > 2 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                        </li>
                                    )}

                                    {transactions.current_page > 3 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}

                                    {transactions.current_page > 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(transactions.current_page - 1)}
                                            >
                                                {transactions.current_page - 1}
                                            </button>
                                        </li>
                                    )}

                                    <li className="page-item active">
                                        <span className="page-link">{transactions.current_page}</span>
                                    </li>

                                    {transactions.current_page < transactions.last_page && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(transactions.current_page + 1)}
                                            >
                                                {transactions.current_page + 1}
                                            </button>
                                        </li>
                                    )}

                                    {transactions.current_page < transactions.last_page - 2 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}

                                    {transactions.current_page < transactions.last_page - 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(transactions.last_page)}
                                            >
                                                {transactions.last_page}
                                            </button>
                                        </li>
                                    )}

                                    <li className={`page-item ${transactions.current_page === transactions.last_page ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(transactions.current_page + 1)}
                                            disabled={transactions.current_page === transactions.last_page}
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

export default Transactions;