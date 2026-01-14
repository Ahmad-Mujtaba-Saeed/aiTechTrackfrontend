import React from "react";
import { Table, Dropdown, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import FormatDateTime from "../../../components/FormatDateTime";

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
  const navigate = useNavigate();

  return (
    <>
      <div className="">
        <table className="table  align-middle mb-0 cv-table">
          <thead className="table-light">
            <tr>
              <th className="text-start ps-0" style={{ maxWidth: compact ? 300 : "unset" }}>
                CV Title
              </th>
              <th>Date Created</th>
              <th>Last Update</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="text-start text-truncate" style={{ maxWidth: compact ? 300 : "unset" }}>
                  {item?.title || "Untitled"}
                </td>

                <td><small>{item?.created_at ? <FormatDateTime dateString={item.created_at} /> : "Unknown date"}</small></td>
                <td><small>{item?.updated_at ? <FormatDateTime dateString={item.updated_at} /> : "Unknown date"}</small></td>

                <td className="text-end">
                  <div className="d-flex gap-1 justify-content-end align-items-center">
                    <span onClick={()=>{navigate(`/cv-generate/${item?.id}`)}} className="custom-History-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                    </span>

                    <span onClick={()=>{navigate(`/cv-generate/${item?.id}?download=true`)}} target="_blank" className="custom-History-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cloud-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" /><path d="M12 13l0 9" /><path d="M9 19l3 3l3 -3" /></svg>
                    </span>

                    <span
                      onClick={() => handleRenameCv(item?.id, item?.title)} className="custom-History-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    </span>

                    <span
                      onClick={() => handleDeleteCv(item?.id)}
                      className={`${delResumeLoader ? "text-muted" : "text-danger"} custom-History-btn custom-history-danger`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                    </span>
                  </div>
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
