import React from "react";
import { Table, Dropdown, Button, Pagination } from "react-bootstrap";

const RecentCVsTable = ({
  data,
  currentPage,
  setCurrentPage,
  lastPage,
  delResumeLoader,
  handleRenameCv,
  handleDeleteCv,
  compact = false // compact = dashboard mode, full = modal mode
}) => {
  return (
    <>
      <div className="">
        <table className="table table-hover align-middle mb-0 cv-table">
          <thead className="table-light">
            <tr>
              <th className="text-start ps-0" style={{ maxWidth: compact ? 300 : "unset" }}>
                CV Title
              </th>
              <th>Date Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="text-start text-truncate" style={{ maxWidth: compact ? 300 : "unset" }}>
                  {item?.resume?.title || "Untitled"}
                </td>

                <td>{item?.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown date"}</td>

                <td className="text-end">
                  {/* Dashboard: dropdown | Modal: buttons */}
                  {compact ? (
                    <Dropdown drop="bottom" align="start">
                      <Dropdown.Toggle variant="outline-secondary" size="sm" className="p-2">
                        {/* <i className="bi bi-three-dots-vertical"></i> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-menu-end">
                        <Dropdown.Item href={`/cv-generate/${item?.resume?.id}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                          View
                        </Dropdown.Item>

                        <Dropdown.Item href={`/cv-generate/${item?.resume?.id}?download=true`} target="_blank">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
                          Download
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => handleRenameCv(item?.resume?.id, item?.resume?.title)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                          Rename
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item
                          onClick={() => handleDeleteCv(item?.resume?.id)}
                          disabled={delResumeLoader}
                          className={delResumeLoader ? "text-muted" : "text-danger"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                          {delResumeLoader ? "Deleting..." : "Delete"}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        href={`/cv-generate/${item?.resume?.id}`}
                      >
                        View
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        href={`/cv-generate/${item?.resume?.id}?download=true`}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination className="mb-0">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />

            {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
              let pageNum;

              if (lastPage <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= lastPage - 2) pageNum = lastPage - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              onClick={() => setCurrentPage(Math.min(currentPage + 1, lastPage))}
              disabled={currentPage === lastPage}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(lastPage)}
              disabled={currentPage === lastPage}
            />
          </Pagination>
        </div>
      )}
    </>
  );
};

export default RecentCVsTable;
