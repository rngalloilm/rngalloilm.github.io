import React from 'react';
import ReactMarkdown from 'react-markdown';

//component for display components in markdown 
const MarkdownDisplay = ({ markdownContent }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;