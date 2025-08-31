import React, { useEffect, useState } from 'react';
import { getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import '../MarkdownContent.css';

//Displays the developers guide
const DevelopersGuide = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        //Gets the developers guide from the backend
        const content = await getDocument('DeveloperGuide');
        setMarkdownContent(content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContent();
  }, []);

  if (error) {
    return <div className="error-message">Error loading document: {error}</div>;
  }
  //Displays the actual text held within the developers guide.
  return (
    <div className="content-container">
      <h2 className="section-title">Developer's Guide</h2>
      <div className="markdown-content">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default DevelopersGuide;