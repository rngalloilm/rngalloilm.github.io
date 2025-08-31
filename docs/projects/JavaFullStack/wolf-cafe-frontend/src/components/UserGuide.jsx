//necessary imports 
import React, { useEffect, useState } from 'react';
import { getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import '../MarkdownContent.css';
//component to dispaly the user guide 
const UserGuide = () => {
  const [markdownContent, setMarkdownContent] = useState(''); //stores the markdown contnet of user guide 
  const [error, setError] = useState(null); //store the error messages 
	//fetches the content of the user guide 
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getDocument('UserGuide');
        setMarkdownContent(content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContent();
  }, []);
	//display an error message if the document can not be loaded
  if (error) {
    return <div className="error-message">Error loading document: {error}</div>;
  }

  return (
    <div className="content-container">
      <h2 className="section-title">User Guide</h2>
      <div className="markdown-content">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default UserGuide;