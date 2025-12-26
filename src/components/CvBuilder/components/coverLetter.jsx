import React , {useEffect, useState, useCallback, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateCoverLetter , setCoverLetterJson} from "../../../features/resume/resumeSlice";
import { ClassicCoverLetterTemplate } from "../../cover-letter-templates";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const CoverLetter = () =>{
  const dispatch = useDispatch();
  const { parsedResume , coverletterjson , coverletterLoader } = useSelector((state) => state.resume);
  const coverRef = useRef(null);
  
  const ensureDefaultCoverLetter = useCallback(() => {
    const defaults = {
      header: {
        applicant_name: "",
        applicant_address: "",
        applicant_email: "",
        applicant_phone: "",
        date: ""
      },
      recipient: {
        hiring_manager_name: "",
        company_name: "",
        company_address: ""
      },
      body: {
        greeting: "Dear Hiring Manager,",
        opening_paragraph: "",
        middle_paragraphs: [""],
        closing_paragraph: "",
        signature: "Sincerely, {applicant_name}"
      }
    };
    return defaults;
  }, []);

  useEffect(() => {
    if (!coverletterjson || typeof coverletterjson !== 'object') {
      dispatch(setCoverLetterJson(ensureDefaultCoverLetter()));
      return;
    }
    const next = { ...ensureDefaultCoverLetter(), ...coverletterjson };
    next.header = { ...ensureDefaultCoverLetter().header, ...(coverletterjson.header || {}) };
    next.recipient = { ...ensureDefaultCoverLetter().recipient, ...(coverletterjson.recipient || {}) };
    const bodyDefaults = ensureDefaultCoverLetter().body;
    const incomingBody = coverletterjson.body || {};
    next.body = {
      ...bodyDefaults,
      ...incomingBody,
      middle_paragraphs: Array.isArray(incomingBody.middle_paragraphs) && incomingBody.middle_paragraphs.length > 0 ? incomingBody.middle_paragraphs : bodyDefaults.middle_paragraphs
    };
    if (JSON.stringify(next) !== JSON.stringify(coverletterjson)) {
      dispatch(setCoverLetterJson(next));
    }
  }, [coverletterjson, dispatch, ensureDefaultCoverLetter]);

  const updateHeader = (field, value) => {
    const next = {
      ...(coverletterjson || ensureDefaultCoverLetter()),
      header: { ...(coverletterjson?.header || {}), [field]: value }
    };
    dispatch(setCoverLetterJson(next));
  };

  const updateRecipient = (field, value) => {
    const next = {
      ...(coverletterjson || ensureDefaultCoverLetter()),
      recipient: { ...(coverletterjson?.recipient || {}), [field]: value }
    };
    dispatch(setCoverLetterJson(next));
  };

  const updateBody = (field, value) => {
    const next = {
      ...(coverletterjson || ensureDefaultCoverLetter()),
      body: { ...(coverletterjson?.body || {}), [field]: value }
    };
    dispatch(setCoverLetterJson(next));
  };

  const updateBodyParagraph = (index, value) => {
    const paragraphs = Array.isArray(coverletterjson?.body?.middle_paragraphs)
      ? [...coverletterjson.body.middle_paragraphs]
      : [""];
    paragraphs[index] = value;
    updateBody('middle_paragraphs', paragraphs);
  };

  const addParagraph = () => {
    const paragraphs = Array.isArray(coverletterjson?.body?.middle_paragraphs)
      ? [...coverletterjson.body.middle_paragraphs]
      : [];
    paragraphs.push("");
    updateBody('middle_paragraphs', paragraphs);
  };

  const removeParagraph = (index) => {
    const paragraphs = Array.isArray(coverletterjson?.body?.middle_paragraphs)
      ? [...coverletterjson.body.middle_paragraphs]
      : [];
    if (paragraphs.length <= 1) return;
    paragraphs.splice(index, 1);
    updateBody('middle_paragraphs', paragraphs);
  };
    
  const handleGenerateCoverLetter = () => {
    const formData = new FormData();
    console.log(parsedResume, "parsedResume");
    formData.append('jsonResume', JSON.stringify(parsedResume));
    dispatch(generateCoverLetter(formData));
  }


  const handleDownloadCoverLetter = async () => {
    if (!coverRef.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const a4Width = 210;
    const a4Height = 297;
    const a4WidthPx = 794;
    const a4HeightPx = 1123;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${a4WidthPx}px`;
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.boxSizing = 'border-box';

    const cloned = coverRef.current.cloneNode(true);
    cloned.style.width = `${a4WidthPx}px`;
    cloned.style.margin = '0 auto';
    cloned.style.padding = '24px';
    cloned.style.fontSize = '12px';
    cloned.style.lineHeight = '1.5';

    tempContainer.appendChild(cloned);
    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(cloned, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: a4WidthPx,
        height: a4HeightPx,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * a4Width) / canvas.width;
      const yPos = Math.max(0, (a4Height - imgHeight) / 2);

      pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
      const filename = `${parsedResume?.candidateName?.[0]?.firstName || 'CoverLetter'}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('Error generating Cover Letter PDF:', err);
    } finally {
      document.body.removeChild(tempContainer);
    }
  }

  const handleCopyToClipboard = () => {
    const cl = coverletterjson || {};
    const header = cl.header || {};
    const recipient = cl.recipient || {};
    const body = cl.body || {};

    const lines = [];

    if (header.applicant_name) lines.push(header.applicant_name);
    if (header.applicant_address) lines.push(header.applicant_address);
    if (header.applicant_email) lines.push(header.applicant_email);
    if (header.applicant_phone) lines.push(header.applicant_phone);
    if (header.date) lines.push(header.date);

    lines.push("");

    if (recipient.hiring_manager_name) lines.push(recipient.hiring_manager_name);
    if (recipient.company_name) lines.push(recipient.company_name);
    if (recipient.company_address) lines.push(recipient.company_address);

    lines.push("");

    lines.push(body.greeting || "Dear Hiring Manager,");
    lines.push("");
    if (body.opening_paragraph) lines.push(body.opening_paragraph);
    if (Array.isArray(body.middle_paragraphs)) {
      body.middle_paragraphs.forEach(p => { if (p) lines.push(p); });
    }
    if (body.closing_paragraph) {
      lines.push("");
      lines.push(body.closing_paragraph);
    }
    lines.push("");

    const signature = (body.signature || "Sincerely, {applicant_name}")
      .replace('{applicant_name}', header.applicant_name || "");
    lines.push(signature);

    const plainText = lines.join('\n');
    navigator.clipboard.writeText(plainText);
  }

  return (
    <>
     <div>
      <div className="d-flex gap-2 mb-3">
        <div>
          <button className='btn btn-primary' onClick={handleGenerateCoverLetter} disabled={coverletterLoader}>{coverletterLoader ? "Generating Cover Letter..." : "Generate Cover Letter"}</button>
        </div>
        <div>
          <button className='btn btn-primary' onClick={handleDownloadCoverLetter}>Download Cover Letter</button>
        
        </div>
      </div>
        <div className="row g-4">
          <div className="col-12 col-lg-12">
            <h4 className="mb-3">Edit Cover Letter</h4>
            <div className="card p-3">
              <h6 className="mt-2">Header</h6>
              <div className="mb-2">
                <label className="form-label">Applicant Name</label>
                <input className="form-control" value={coverletterjson?.header?.applicant_name || ''} onChange={(e) => updateHeader('applicant_name', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Applicant Address</label>
                <input className="form-control" value={coverletterjson?.header?.applicant_address || ''} onChange={(e) => updateHeader('applicant_address', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Applicant Email</label>
                <input className="form-control" value={coverletterjson?.header?.applicant_email || ''} onChange={(e) => updateHeader('applicant_email', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Applicant Phone</label>
                <input className="form-control" value={coverletterjson?.header?.applicant_phone || ''} onChange={(e) => updateHeader('applicant_phone', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input className="form-control" value={coverletterjson?.header?.date || ''} onChange={(e) => updateHeader('date', e.target.value)} />
              </div>

              <h6 className="mt-3">Recipient</h6>
              <div className="mb-2">
                <label className="form-label">Hiring Manager Name</label>
                <input className="form-control" value={coverletterjson?.recipient?.hiring_manager_name || ''} onChange={(e) => updateRecipient('hiring_manager_name', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Company Name</label>
                <input className="form-control" value={coverletterjson?.recipient?.company_name || ''} onChange={(e) => updateRecipient('company_name', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Company Address</label>
                <input className="form-control" value={coverletterjson?.recipient?.company_address || ''} onChange={(e) => updateRecipient('company_address', e.target.value)} />
              </div>

              <h6 className="mt-3">Body</h6>
              <div className="mb-2">
                <label className="form-label">Greeting</label>
                <input className="form-control" value={coverletterjson?.body?.greeting || ''} onChange={(e) => updateBody('greeting', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Opening Paragraph</label>
                <textarea className="form-control" rows="3" value={coverletterjson?.body?.opening_paragraph || ''} onChange={(e) => updateBody('opening_paragraph', e.target.value)} />
              </div>
              <div className="mb-2">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label mb-0">Middle Paragraphs</label>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={addParagraph}>Add paragraph</button>
                </div>
                {Array.isArray(coverletterjson?.body?.middle_paragraphs) && coverletterjson.body.middle_paragraphs.map((p, idx) => (
                  <div key={idx} className="d-flex gap-2 align-items-start mt-2">
                    <textarea className="form-control" rows="3" value={p || ''} onChange={(e) => updateBodyParagraph(idx, e.target.value)} />
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeParagraph(idx)} disabled={(coverletterjson?.body?.middle_paragraphs?.length || 0) <= 1}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="mb-2">
                <label className="form-label">Closing Paragraph</label>
                <textarea className="form-control" rows="3" value={coverletterjson?.body?.closing_paragraph || ''} onChange={(e) => updateBody('closing_paragraph', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label">Signature</label>
                <input className="form-control" value={coverletterjson?.body?.signature || ''} onChange={(e) => updateBody('signature', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-12">
            <h3>Classic Cover Letter</h3>
            <div ref={coverRef}>
              <ClassicCoverLetterTemplate coverLetter={coverletterjson} />
            </div>
            <button className="btn btn-primary border-0 mt-2" onClick={handleCopyToClipboard}>Copy to clipboard</button>
          </div>
        </div>
      </div>
    </>
  )
}


export default CoverLetter;