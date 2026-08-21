import React, { useEffect, useState } from "react";
import { Card, Dropdown, Button, Pagination } from 'react-bootstrap';
import { Icon } from "@iconify/react";
import axios from '../../../api/axios';
import FormatDateTime from '../../../components/FormatDateTime';

const RecentActivitiesPlatform = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null
    });

    const fetchActivities = async (page = 1, perPage = 10) => {
        setLoading(true);
        try {
            const response = await axios.get(`/admin/dashboard/recent-activities?page=${page}&per_page=${perPage}`);
            setActivities(response.data.activities || []);
            setPagination(response.data.pagination || {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0,
                from: null,
                to: null
            });
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handlePageChange = (pageNumber) => {
        fetchActivities(pageNumber, pagination.per_page);
    };

    const getActivityIcon = (event, type) => {
        const iconMap = {
            'created': 'mdi:plus-circle',
            'updated': 'mdi:pencil',
            'deleted': 'mdi:delete',
            'default': 'mdi:information'
        };

        return iconMap[event] || iconMap['default'];
    };

    // Always show paginated activities, no more showAll state
    const displayActivities = activities;

    return (
        <Card className="border h-100">
            <Card.Body className="p-0">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <div>
                        <h5 className="mb-0">Recent Activities</h5>
                        <p className="text-muted mb-0 small">Latest system activities</p>
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <Icon icon="mdi:dots-vertical" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => fetchActivities(pagination.current_page, pagination.per_page)}>
                                <Icon icon="mdi:refresh" className="me-2" /> Refresh
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Activities List */}
                <div className="p-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : displayActivities.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <Icon icon="mdi:history" className="d-block mb-2" style={{ fontSize: '2rem' }} />
                            No recent activities found
                        </div>
                    ) : (
                        <div className="timeline">
                            {displayActivities.map((activity, index) => (
                                <div key={activity.id} className="d-flex align-items-start mb-3">
                                    <div className="me-3">
                                        <div className={`bg-light rounded-circle p-2 d-flex align-items-center justify-content-center`}>
                                            <Icon 
                                                icon={getActivityIcon(activity.event, activity.auditable_type)} 
                                                className="text-primary"
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <p className="mb-1 fw-medium">{activity.message}</p>
                                                {activity.user && (
                                                    <small className="text-muted">
                                                        by {activity.user.name} ({activity.user.email})
                                                    </small>
                                                )}
                                            </div>
                                            <small className="text-muted">
                                                <FormatDateTime dateString={activity.created_at} time={true} />
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="p-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                Showing {pagination.from} to {pagination.to} of {pagination.total} activities
                            </small>
                            <Pagination>
                                <Pagination.Prev 
                                    disabled={pagination.current_page === 1}
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                />
                                <Pagination.Item 
                                    active={pagination.current_page === 1}
                                    onClick={() => handlePageChange(1)}
                                >
                                    1
                                </Pagination.Item>
                                
                                {/* Show current page +/- 1 if not at edges */}
                                {pagination.current_page > 2 && (
                                    <Pagination.Item 
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                    >
                                        {pagination.current_page - 1}
                                    </Pagination.Item>
                                )}
                                
                                {pagination.current_page < pagination.last_page - 1 && (
                                    <Pagination.Item 
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                    >
                                        {pagination.current_page + 1}
                                    </Pagination.Item>
                                )}
                                
                                <Pagination.Item 
                                    active={pagination.current_page === pagination.last_page}
                                    onClick={() => handlePageChange(pagination.last_page)}
                                >
                                    {pagination.last_page}
                                </Pagination.Item>
                                
                                <Pagination.Next 
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                />
                            </Pagination>
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default RecentActivitiesPlatform;
