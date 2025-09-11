import { deleteFile } from "../services/api-client/fileService";
import React, { useState } from 'react';

const FileList = ({ files, updateFiles }) => {
    const [currentFileIndex, setCurrentFileIndex] = useState(0);

    const handleDelete = async (file) => {
        
        if (files.length === 0) {
            return;
        }

        let deleteFileId = file.fileId;
        const newFiles = files.filter((f) => f.fileId !== deleteFileId);

        if (newFiles.length === 0) {
            setCurrentFileIndex(0);
        } else {
            setCurrentFileIndex((prevIndex) =>
            prevIndex === newFiles.length - 1 ? 0 : prevIndex
          );
        }

        updateFiles(newFiles);
    
        const response = await deleteFile(deleteFileId);
    
        if(response.status !== 200) {
            console.log(`Error deleting file with id: ${file.fileId}`);
        }
    }

    return (
        <div>
            <h1>File List</h1>
            {files.map((file) => (
                <div class="upload" key={file.fileId}>
                    <div class="file-upload">
                    <a className='file-list-text' href={`${file.fileData}`} download={`${file.fileName}`}>
                        {file.fileName}
                    </a>
                     </div>
                    <button className="file-list-btn" onClick={() => handleDelete(file)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default FileList;
