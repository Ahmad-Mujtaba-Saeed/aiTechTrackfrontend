import { useState, useMemo, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import toggleImage from '../assets/images/P-solid-rgb.svg';
import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs, updateAppliedJob, setAppliedJobs, deleteAppliedJob, JobAppliedCreate } from "../features/job/jobSlice";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import Swal from "sweetalert2";

export default function ApplicationTracking() {
    const dispatch = useDispatch();
    const { appliedJobs } = useSelector((state) => state.job);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(fetchAppliedJobs()).unwrap();
                console.log("response ", res);
            } catch (err) {
                console.error("Failed to fetch applied jobs", err);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this job!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(deleteAppliedJob(id)).unwrap();
                    const updatedJobs = appliedJobs.filter(job => job.id !== id);
                    dispatch(setAppliedJobs(updatedJobs));
                    // Swal.fire(
                    //     'Deleted!',
                    //     'Job has been deleted.',
                    //     'success'
                    // );
                } catch (error) {
                    console.error('Failed to delete job:', error);
                    // Swal.fire(
                    //     'Failed!',
                    //     'Failed to delete job.',
                    //     'error'
                    // );
                }
            }
        });
    };

    // ✅ Update job status
    const handleStatusChange = async (id, newStatus) => {
        try {
            await dispatch(updateAppliedJob({
                id,
                updates: { status: newStatus }
            })).unwrap();

            // dispatch(setAppliedJobs(prev => {
            //     const jobsArray = Array.isArray(prev?.data) ? prev.data : Array.isArray(prev) ? prev : [];
            //     const updated = jobsArray.map(item =>
            //         item.id === id ? { ...item, status: newStatus } : item
            //     );

            //     // Keep original structure if it's `{ data: [] }`
            //     return Array.isArray(prev?.data) ? { ...prev, data: updated } : updated;
            // }));

            const jobsArray = Array.isArray(appliedJobs?.data)
                ? appliedJobs.data
                : Array.isArray(appliedJobs)
                    ? appliedJobs
                    : [];

            const updated = jobsArray.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            );

            dispatch(setAppliedJobs(updated));   // ✅ payload is plain array


            // alertify.success("Status updated successfully ✅");
        } catch (error) {
            console.error('Failed to update status:', error);
            // alertify.error("Failed to update status ❌");
        }
    };


    // ✅ Toggle fields (cvCreated, interviewPractised, applied)
    const handleToggle = async (id, field) => {
        try {
            // First, ensure we have the jobs array
            const jobsArray = Array.isArray(appliedJobs?.data)
                ? appliedJobs.data
                : Array.isArray(appliedJobs)
                    ? appliedJobs
                    : [];

            // Find the current value from the jobs array
            const currentItem = jobsArray.find(item => item.id === id);
            if (!currentItem) {
                throw new Error('Job not found');
            }

            const currentValue = currentItem[field];
            const newValue = !currentValue;

            const backendField = {
                'cvCreated': 'cv_created',
                'interviewPractised': 'interview_practice',
                'applied': 'applied'
            }[field] || field;

            await dispatch(updateAppliedJob({
                id,
                updates: { [backendField]: newValue }
            })).unwrap();

            // Update the Redux state
            const updated = jobsArray.map(item =>
                item.id === id ? {
                    ...item,
                    [field]: newValue,
                    [backendField]: newValue
                } : item
            );

            dispatch(setAppliedJobs(updated));

            // alertify.success(`${field} updated successfully ✅`);
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            // alertify.error(`Failed to update ${field} ❌`);
        }
    };

    // ✅ Format jobs safely
    const formattedJobs = useMemo(() => {
        const jobsArray = Array.isArray(appliedJobs?.data)
            ? appliedJobs.data
            : Array.isArray(appliedJobs)
                ? appliedJobs
                : [];

        return jobsArray.map(job => ({
            id: job.id,
            position: job.title || job.position || 'No Title',
            company: job.company || 'No Company',
            positionLink: job.job?.job_apply_link || job.positionLink || '#',
            applicationDate: job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : job.applicationDate || 'N/A',
            cvCreated: Boolean(job.cv_created ?? job.cvCreated),
            interviewPractised: Boolean(job.interview_practice ?? job.interviewPractised),
            applied: Boolean(job.applied),
            status: job.status || 'prep'
        }));
    }, [appliedJobs]);

    const columns = useMemo(() => [
        {
            name: (<strong>JOB POSITION</strong>),
            selector: row => row?.position,
            sortable: true,
            cell: row => (
                <a className="fw-bold text-primary text-decoration-none" href={row?.positionLink} target="_blank" rel="noopener noreferrer">
                    {row?.position}
                </a>
            ),
            minWidth: '300px',
            grow: 2,
        },
        {
            name: (<strong>APPLICATION</strong>),
            selector: row => row?.applicationDate,
            sortable: true,
            cell: row => (
                <p className="mb-0 fs-9 text-body">{row?.applicationDate}</p>
            ),
            minWidth: '120px'
        },
        {
            name: (<strong>COMPANY</strong>),
            selector: row => row?.company,
            sortable: true,
            cell: row => (
                <p className="mb-0 fs-9 text-body">{row?.company}</p>
            ),
            minWidth: '120px'
        },
        {
            name: <div style={{ textAlign: 'center'}}><strong>CV CREATED</strong></div>,
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row.cvCreated ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row.cvCreated}
                    onClick={() => handleToggle(row.id, 'cvCreated')}
                >
                    <img
                        src={toggleImage}
                        alt="Complete icon"
                        width="28"
                        height="28"
                        style={{
                            opacity: row.cvCreated ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                </button>
            ),
            minWidth: '100px'
        },
        {
            name: (<div style={{ textAlign: 'center'}}><strong>APPLIED</strong></div>),
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row?.applied ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row?.applied}
                    onClick={() => handleToggle(row?.id, 'applied')}
                >
                    <img
                        src={toggleImage}
                        alt="Complete icon"
                        width="28"
                        height="28"
                        style={{
                            opacity: row?.applied ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                </button>
            ),
            minWidth: '100px'
        },
        {
            name: (<div style={{ textAlign: 'center'}}><strong>INTERVIEW PRACTISED</strong></div>),
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row?.interviewPractised ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row?.interviewPractised}
                    onClick={() => handleToggle(row?.id, 'interviewPractised')}
                >
                    <img
                        src={toggleImage}
                        alt="Complete icon"
                        width="28"
                        height="28"
                        style={{
                            opacity: row?.interviewPractised ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                </button>
            ),
            minWidth: '150px'
        },
        {
            name: <strong>STATUS</strong>,
            cell: row => (
                <select
                    className="form-select form-select-sm"
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    style={{ minWidth: '200px' }}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ),
            minWidth: '250px'
        },
        {
            name: <strong>Action</strong>,
            cell: row => (
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
            ),
            minWidth: '250px'
        }
    ], [appliedJobs]);

    const statusOptions = [
        { value: 'prep', label: 'Preparing Application' },
        { value: 'appSent', label: 'Application Sent' },
        { value: 'shortListed', label: 'Shortlisted' },
        { value: '1stInterview', label: '1st Stage Interview' },
        { value: '2ndInterview', label: '2nd Stage Interview' },
        { value: 'finalInterview', label: 'Final Interview' },
        { value: 'onHold', label: 'On Hold' },
        { value: 'OfferAcctepted', label: 'Offer Accepted' },
        { value: 'UnSuccessful', label: 'Unsuccessful' }
    ];

    return (
        <div className="card">

            <div className="card-body">
                {/* Add Application Modal */}

                
                <div className="table-responsive scrollbar">
                    <DataTable
                        columns={columns}
                        data={formattedJobs}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 25, 50]}
                        noDataComponent={
                            <div className="text-center py-4">
                                <p className="text-muted">No applications found</p>
                            </div>
                        }
                        responsive
                        className="border-top border-translucent"
                    />
                </div>
            </div>
        </div>
    );
}
