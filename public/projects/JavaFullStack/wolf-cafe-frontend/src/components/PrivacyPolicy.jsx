//neccesary imports
import React, { useEffect, useState } from 'react';
import { getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import '../MarkdownContent.css';
//component to display the privacy policy content
const PrivacyPolicy = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [error, setError] = useState(null);
//fetch the privacy policy document 
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getDocument('PrivacyPolicy');
        setMarkdownContent(content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContent();
  }, []);
	//if there is an error then the error message is displayed 
  if (error) {
    return <div className="error-message">Error loading document: {error}</div>;
  }

  return (
    <div className="content-container">
      <h2 className="section-title">Privacy Policy</h2>
      <div className="markdown-content">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PrivacyPolicy;