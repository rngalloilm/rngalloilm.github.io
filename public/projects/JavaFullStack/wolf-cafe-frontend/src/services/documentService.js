export const getDocument = async (category, isPdf = false) => {
  const url = isPdf
    ? `http://localhost:8080/api/document/pdf/${category}`
    : `http://localhost:8080/api/document/${category}`;
    
  //Gets the document at the given path in our backend
  const response = await fetch(url);
  
  //If we get a bad response, throw an error
  if (!response.ok) {
    throw new Error(`Error fetching document: ${response.statusText}`);
  }
  
  //Two paths for different file types (PDF vs Markdown)
  if (isPdf) {
    // Return the blob for PDFs
    return await response.blob();
  } else {
    // Return text content for markdown files
    return await response.text();
  }
};