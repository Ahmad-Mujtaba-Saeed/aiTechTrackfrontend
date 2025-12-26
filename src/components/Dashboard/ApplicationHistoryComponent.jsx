import { useState, useMemo, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import toggleImage from '../../assets/images/P-solid-rgb.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default function ApplicationHistory() {
    const [data, setData] = useState([
        {
            id: 1,
            position: "Senior Software Developer - Sample Job",
            positionLink: "#",
            applicationDate: "June 12, 2025",
            company: "Vision Launch",
            cvCreated: false,
            interviewPractised: false,
            applied: false,
            status: "Preparing Application"
        },
        {
            id: 2,
            position: "IT Technician - Front Desk Support",
            positionLink: "#",
            applicationDate: "June 9, 2025",
            company: "Virgin Media",
            cvCreated: false,
            interviewPractised: false,
            applied: false,
            status: "Preparing Application"
        },
        {
            id: 3,
            position: "Graphic Designer - Entry Level",
            positionLink: "#",
            applicationDate: "June 9, 2025",
            company: "Microsoft",
            cvCreated: false,
            interviewPractised: false,
            applied: false,
            status: "Preparing Application"
        },
        {
            id: 4,
            position: "Frontend Developer",
            positionLink: "#",
            applicationDate: "June 15, 2025",
            company: "Google",
            cvCreated: true,
            interviewPractised: false,
            applied: true,
            status: "Application Sent"
        },
        {
            id: 5,
            position: "Backend Engineer",
            positionLink: "#",
            applicationDate: "June 10, 2025",
            company: "Amazon",
            cvCreated: true,
            interviewPractised: true,
            applied: true,
            status: "1st Stage Interview"
        }
    ]);

    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});

    const statusOptions = [
        "Preparing Application",
        "Application Sent",
        "Shortlisted",
        "1st Stage Interview",
        "2nd Stage Interview",
        "Final Interview",
        "On Hold / Awaiting Decision",
        "Offer Accepted",
        "Unsuccessful"
    ];

    const handleStatusChange = (id, newStatus) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    const handleToggle = (id, field) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: !item[field] } : item
            )
        );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && dropdownRefs.current[openDropdown] &&
                !dropdownRefs.current[openDropdown].contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const ActionDropdown = ({ row }) => {
        const dropdownRef = useRef(null);

        useEffect(() => {
            dropdownRefs.current[row.id] = dropdownRef.current;
            return () => delete dropdownRefs.current[row.id];
        }, [row.id]);

        return (
            <div className="btn-reveal-trigger position-static" ref={dropdownRef}>
                <Dropdown align="end"
                    id="dropdown-menu-align-end">
                    <Dropdown.Toggle id="example1" className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10">
                        <svg className="svg-inline--fa fa-ellipsis fs-10" width={10} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"></path>
                        </svg>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1" >
                            Action
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    };

    const columns = useMemo(() => [
        {
            name: (<strong>JOB POSITION</strong>),
            selector: row => row.position,
            sortable: true,
            cell: row => (
                <a className="fw-bold text-primary text-decoration-none" href={row.positionLink}>
                    {row.position}
                </a>
            ),
            minWidth: '300px',
            grow: 2
        },
        {
            name: (<strong>APPLICATION</strong>),
            selector: row => row.applicationDate,
            sortable: true,
            cell: row => (
                <p className="mb-0 fs-9 text-body">{row.applicationDate}</p>
            ),
            minWidth: '120px'
        },
        {
            name: (<strong>COMPANY</strong>),
            selector: row => row.company,
            sortable: true,
            cell: row => (
                <p className="mb-0 fs-9 text-body">{row.company}</p>
            ),
            minWidth: '120px'
        },
        {
            name: (<strong>CV CREATED</strong>),
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row.cvCreated ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row.cvCreated}
                    onClick={() => handleToggle(row.id, 'cvCreated')}
                    title="Mark as complete"
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
            name: (<strong>INTERVIEW PRACTISED</strong>),
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row.interviewPractised ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row.interviewPractised}
                    onClick={() => handleToggle(row.id, 'interviewPractised')}
                    title="Mark as complete"
                >
                    <img
                        src={toggleImage}
                        alt="Complete icon"
                        width="28"
                        height="28"
                        style={{
                            opacity: row.interviewPractised ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                </button>
            ),
            minWidth: '150px'
        },
        {
            name: (<strong>APPLIED</strong>),
            center: true,
            cell: row => (
                <button
                    className={`icon-toggle border-0 bg-transparent ${row.applied ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={row.applied}
                    onClick={() => handleToggle(row.id, 'applied')}
                    title="Mark as complete"
                >
                    <img
                        src={toggleImage}
                        alt="Complete icon"
                        width="28"
                        height="28"
                        style={{
                            opacity: row.applied ? 1 : 0.3,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                </button>
            ),
            minWidth: '100px'
        },
        {
            name: (<strong>STATUS</strong>),
            cell: row => (
                <select
                    className="form-select form-select-sm"
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    style={{ minWidth: '200px' }}
                >
                    {statusOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ),
            minWidth: '250px'
        },
        // {
        //     name: (<strong>ACTION</strong>),
        //     allowOverflow: true,
        //     button: true,
        //     cell: row => <ActionDropdown row={row} />,
        //     minWidth: '80px',
        //     ignoreRowClick: true
        // }
    ], [openDropdown]);

    const customStyles = {
        headRow: {
            style: {
                fontWeight: 'bold',
                minHeight: '52px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '12px',
                paddingRight: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem',
                padding: '16px'
            },
        },
        pagination: {
            style: {
                borderBottomLeftRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
            },
        },
    };

    return (
        <div className="row mt-3">
            <div className="col-12">
                <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 bg-body-emphasis pt-6 border-top">
                    <div className="row align-items-end justify-content-between pb-4 g-3">
                        <div className="col-auto">
                            <h3 className="mb-0">Application History</h3>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 25, 50]}
                        noDataComponent={
                            <div className="text-center py-4">
                                <p className="text-muted">No applications found</p>
                            </div>
                        }
                        responsive
                        customStyles={customStyles}
                        className="border-top border-translucent"
                    />
                </div>
            </div>
        </div>
    );
}