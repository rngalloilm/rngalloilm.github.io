import React from 'react';
import '../styles/resumeStyle.css';

function ResumePage() {
  // Path to the resume PDF in the /public folder with view parameters
  const resumePdfPath = '/Resume-7-2025.pdf#zoom=100&pagemode=none';

  return (
    <div className="resume-container">
      <h1 className="resume-title">My Resume</h1>
      <p className="resume-download-link">
        Can't see the PDF? <a href="/resume.pdf" download="resume.pdf">Download it here</a>.
      </p>
      <div className="resume-viewer">
        <iframe
          src={resumePdfPath}
          className="resume-iframe"
          title="My Resume PDF"
        >
          {/* Fallback content for browsers that don't support iframes or PDFs */}
          <p>Your browser does not support PDFs. Please use the download link above to view it.</p>
        </iframe>
      </div>
    </div>
  );
}

export default ResumePage;