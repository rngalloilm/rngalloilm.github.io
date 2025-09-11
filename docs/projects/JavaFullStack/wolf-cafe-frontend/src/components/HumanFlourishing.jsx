//import neccessary imports 
import React, { useEffect, useState } from 'react';
import { getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import '../MarkdownContent.css';
//component to dispaly the Human Flourshing document 
const HumanFlourishing = () => {
  const [markdownContent, setMarkdownContent] = useState(''); //store the markdown content of the document
  const [error, setError] = useState(null); //store the error messages 

  //used to fetch the markdown content 
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getDocument('HumanFlourishing');
        setMarkdownContent(content);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContent();
  }, []);
	//if an error occurs, the document can not be loaded 
  if (error) {
    return <div className="error-message">Error loading document: {error}</div>;
  }
	//renders the human floursihing content 
  return (
    <div className="content-container">
      <h2 className="section-title">Human Flourishing</h2>
      <div className="markdown-content">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default HumanFlourishing;