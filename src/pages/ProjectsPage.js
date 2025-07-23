import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/projectsStyle.css';
import '../styles/style.css';
import collections from '../script/projectFiles.json';

function ProjectsPage() {
    // State to track which collection and project dropdowns are open
    const [openCollections, setOpenCollections] = useState({});
    const [openProjects, setOpenProjects] = useState({});
    const [openFolders, setOpenFolders] = useState({});
    const [fileContents, setFileContents] = useState({});

    // New state for description
    const [showDescription, setShowDescription] = useState(false);
    const [descriptionContent, setDescriptionContent] = useState('');

    // Toggle collection dropdown and collapse all children
    const handleCollectionToggle = (collectionName, idx) => {
        const isOpening = !openCollections[idx];

        setOpenCollections(prev => ({
            ...prev,
            [idx]: isOpening
        }));

        // If closing the collection, collapse everything inside it
        if (!isOpening) {
            const collectionPrefix = `${idx}-`;

            // Collapse projects within this collection
            setOpenProjects(prev => {
                const nextState = { ...prev };
                Object.keys(nextState).forEach(key => {
                    if (key.startsWith(collectionPrefix)) {
                        delete nextState[key];
                    }
                });
                return nextState;
            });

            // Collapse folders and files within this collection
            const collapseDescendants = (prevState) => {
                const nextState = { ...prevState };
                Object.keys(nextState).forEach(key => {
                    if (key.startsWith(collectionPrefix)) {
                        delete nextState[key];
                    }
                });
                return nextState;
            };

            setOpenFolders(collapseDescendants);
            setFileContents(collapseDescendants);
        }
    };

    // Toggle project dropdown and collapse its children
    const handleProjectToggle = (collectionIdx, projectIdx, files) => {
        const key = `${collectionIdx}-${projectIdx}`;
        const isOpening = !openProjects[key];

        setOpenProjects(prev => ({
            ...prev,
            [key]: isOpening
        }));

        if (isOpening) {
            // If opening, expand top-level folders
            const fileKeyPrefix = `${key}-`;
            const topFolderKeys = getTopLevelFolderKeys(files, fileKeyPrefix);
            setOpenFolders(prev => {
                const updated = { ...prev };
                topFolderKeys.forEach(folderKey => {
                    updated[folderKey] = true;
                });
                return updated;
            });
        } else {
            // If closing, collapse folders and files within this project
            const projectPrefix = `${key}-`;
            const collapseDescendants = (prevState) => {
                const nextState = { ...prevState };
                Object.keys(nextState).forEach(k => {
                    if (k.startsWith(projectPrefix)) {
                        delete nextState[k];
                    }
                });
                return nextState;
            };
            setOpenFolders(collapseDescendants);
            setFileContents(collapseDescendants);
        }
    };

    // Fetch and show file content
    const handleFileClick = async (filePath, key) => {
        if (fileContents[key]) {
            setFileContents(prev => ({ ...prev, [key]: null }));
        } else {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                setFileContents(prev => ({ ...prev, [key]: text }));
            } catch (error) {
                console.error("Failed to fetch file:", error);
                setFileContents(prev => ({ ...prev, [key]: `Error: Could not load file content.` }));
            }
        }
    };

    // Takes an array of { name, path } and returns a nested tree structure
    function buildFileTree(files) {
        // Filter out any files located in a 'node_modules' directory
        const filteredFiles = files.filter(file => !file.name.split('/').includes('node_modules'));

        const root = {};

        filteredFiles.forEach(file => {
            const parts = file.name.split('/');
            let current = root;
            parts.forEach((part, idx) => {
                if (idx === parts.length - 1) {
                    // It's a file
                    if (!current.files) current.files = [];
                    current.files.push({ ...file, displayName: part });
                } else {
                    // It's a folder
                    if (!current[part]) current[part] = {};
                    current = current[part];
                }
            });
        });

        // Recursively convert the object to an array for rendering
        function toArray(node, folderName = null) {
            let children = [];
            for (const key in node) {
                if (key === 'files') continue;
                children.push({
                    type: 'folder',
                    name: key,
                    children: toArray(node[key], key)
                });
            }
            if (node.files) {
                children = children.concat(
                    node.files.map(f => ({ type: 'file', ...f }))
                );
            }
            return children;
        }

        return toArray(root);
    }

    const [showScript, setShowScript] = useState(false);
    const [scriptContent, setScriptContent] = useState('');

    // Handler to fetch and toggle script display
    const handleShowScript = async () => {
        if (!showScript && !scriptContent) {
            try {
                // Fetch the script file
                const response = await fetch('../scriptGenerateProjectFiles.js');
                const text = await response.text();
                setScriptContent(text);
            } catch (e) {
                setScriptContent("Could not load script content.");
            }
        }
        setShowScript(prev => !prev);
    };

    // New handler to fetch and toggle description display
    const handleShowDescription = async () => {
        if (!showDescription && !descriptionContent) {
            try {
                const response = await fetch('/description.md'); // Fetches from the 'public' folder
                if (!response.ok) throw new Error('Network response was not ok');
                const text = await response.text();
                setDescriptionContent(text);
            } catch (e) {
                console.error(e);
                setDescriptionContent("Could not load description.md. Make sure it's in the 'public' folder.");
            }
        }
        setShowDescription(prev => !prev);
    };

    function FileTree({ nodes, onFileClick, fileContents, fileKeyPrefix = '', openFolders, setOpenFolders, setFileContents }) {
        const handleFolderToggle = (key) => {
            const isOpening = !openFolders[key];
    
            // Toggle the current folder's state
            setOpenFolders(prev => ({ ...prev, [key]: isOpening }));
    
            // If we are closing the folder, collapse all its children
            if (!isOpening) {
                const childPrefix = `${key}/`;
    
                // Function to filter out children from a state object
                const collapseDescendants = (prevState) => {
                    const nextState = { ...prevState };
                    Object.keys(nextState).forEach(k => {
                        if (k.startsWith(childPrefix)) {
                            delete nextState[k];
                        }
                    });
                    return nextState;
                };
    
                // Apply the collapse logic to sub-folders and open files
                setOpenFolders(collapseDescendants);
                setFileContents(collapseDescendants);
            }
        };
    
        return (
            <ul className="filetree-list">
                {nodes.map((node, idx) => {
                    const key = fileKeyPrefix + node.name + idx;
                    if (node.type === 'folder') {
                        return (
                            <li key={key}>
                                <button
                                    className="file-btn filetree-folder-btn"
                                    onClick={() => handleFolderToggle(key)}
                                >
                                    {openFolders[key] ? '▾' : '▸'} {node.name}
                                </button>
                                {openFolders[key] && (
                                    <FileTree
                                        nodes={node.children}
                                        onFileClick={onFileClick}
                                        fileContents={fileContents}
                                        fileKeyPrefix={key + '/'}
                                        openFolders={openFolders}
                                        setOpenFolders={setOpenFolders}
                                        setFileContents={setFileContents} // Pass down
                                    />
                                )}
                            </li>
                        );
                    } else {
                        // It's a file
                        return (
                            <li key={key}>
                                <button
                                    className="file-btn filetree-file-btn"
                                    onClick={() => onFileClick(node.path, key)}
                                >
                                    {node.displayName}
                                </button>
                                {fileContents[key] && (
                                    <pre
                                        className="file-content"
                                        onClick={() => onFileClick(node.path, key)}
                                        title="Click to collapse"
                                    >
                                        {fileContents[key]}
                                    </pre>
                                )}
                            </li>
                        );
                    }
                })}
            </ul>
        );
    }

    function getTopLevelFolderKeys(files, fileKeyPrefix) {
        const tree = buildFileTree(files);
        return tree
            .filter(node => node.type === 'folder')
            .map((node, idx) => fileKeyPrefix + node.name + idx);
    }

    // Separate independent projects and collections
    const independentProjects = collections.filter(
        c => c.collection === null &&
            !c.projects[0].name.startsWith('Java-') &&
            !c.projects[0].name.startsWith('Node-') &&
            !c.projects[0].name.startsWith('C-')
    );

    const groupedCollections = collections.filter(
        c => c.collection !== null ||
            c.projects[0].name.startsWith('Java-') ||
            c.projects[0].name.startsWith('Node-') ||
            c.projects[0].name.startsWith('C-')
    );

    return (
        <main className="projects">
            <div className="projects-header"> 
                <h1 className="projects-title">CSC Coding Projects</h1>

                <h3 className="projects-description">Check out Senior Design and Node-WebApps/Final.</h3>

                <hr className="projects-divider" />
                <div className="projects-extensions">
                    <strong>Supported extensions:</strong> .c, .h, .java, .html, .css, .js, .json, .jsx, .md, .conf, Dockerfile, .yml, .sh, .xml, .pem, .sql<br></br> <br></br>
                    The script below searches my projects in the /public/projects folder and organizes the supported files on this page. 
                </div>

                <button className="show-script-btn" onClick={handleShowScript}>
                    {showScript ? <strong>Hide</strong> : <strong>Show</strong>} scriptGenerateProjectFiles.js
                </button>
                {showScript && (
                    <pre className="script-content-block">{scriptContent}</pre>
                )}

                {/* New button and content block for description.md */}
                <button className="show-description-btn" onClick={handleShowDescription}>
                    {showDescription ? <strong>Hide</strong> : <strong>Show</strong>} Project Description
                </button>
                {showDescription && (
                    <div className="description-content-block">
                        <ReactMarkdown>{descriptionContent}</ReactMarkdown>
                    </div>
                )}
                
                <hr className="projects-divider" />
            </div>

            <div id="projects">
                {/* Independent projects at the top */}
                {independentProjects.map((projectGroup, idx) => {
                    const project = projectGroup.projects[0];
                    const key = `independent-${idx}`;
                    return (
                        <div key={key} className="independent-collection">
                            <button
                                className="independent-collection-btn dropbtn"
                                onClick={() => handleCollectionToggle(project.name, key)}
                            >
                                {project.name}
                            </button>
                            {openCollections[key] && (
                                <div className="collection-content">
                                    <FileTree
                                        nodes={buildFileTree(project.files)}
                                        onFileClick={handleFileClick}
                                        fileContents={fileContents}
                                        fileKeyPrefix={`${key}-`}
                                        openFolders={openFolders}
                                        setOpenFolders={setOpenFolders}
                                        setFileContents={setFileContents}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Collections below */}
                {groupedCollections.map((collection, cIdx) => (
                    <div key={cIdx} className="collection">
                        {/* Collection header (if not null) */}
                        {collection.collection && (
                            <button
                                className="collection-btn dropbtn"
                                onClick={() => handleCollectionToggle(collection.collection, cIdx)}
                            >
                                {collection.collection}
                            </button>
                        )}
                        {/* Only show projects if collection is open, or if it's a standalone project */}
                        {(collection.collection === null || openCollections[cIdx]) && (
                            <div className="collection-content">
                                {collection.projects.map((project, pIdx) => (
                                    <div key={pIdx} className="project">
                                        <button
                                            className="project-btn dropbtn"
                                            onClick={() => handleProjectToggle(cIdx, pIdx, project.files)}
                                        >
                                            {project.name}
                                        </button>
                                        {openProjects[`${cIdx}-${pIdx}`] && (
                                            <div className="project-content">
                                                {project.files && project.files.length > 0 && (
                                                    <FileTree
                                                        nodes={buildFileTree(project.files)}
                                                        onFileClick={handleFileClick}
                                                        fileContents={fileContents}
                                                        fileKeyPrefix={`${cIdx}-${pIdx}-`}
                                                        openFolders={openFolders}
                                                        setOpenFolders={setOpenFolders}
                                                        setFileContents={setFileContents}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default ProjectsPage;