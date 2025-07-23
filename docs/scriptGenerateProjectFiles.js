// Import required modules
const fs = require('fs');
const path = require('path');

// List of supported file extensions and names to include in the project file listing
const SUPPORTED_EXTENSIONS = [
  '.c', '.h', '.java', '.html', '.css', '.js', '.json', '.jsx', '.md', '.conf',
  'Dockerfile', '.yml', '.sh', '.xml', '.pem', '.sql'
];

// Define the main projects directory and the output JSON file path
const PROJECTS_DIR = path.join(__dirname, 'public', 'projects');
const OUTPUT_FILE = path.join(__dirname, 'src/script', 'projectFiles.json');

/**
 * Removes common/unwanted directory segments from a relative file path.
 * This helps clean up file paths for display by removing segments like 'edu', 'ncsu', 'csc', etc.
 * @param {string} relPath - The relative path from the project root to the file
 * @returns {string} - The cleaned-up relative path
 */
function stripCommonFolders(relPath) {
    // Split the path into segments
    let parts = relPath.split('/');
    // Remove any directory segment matching the following rules
    parts = parts.filter(part =>
        part !== 'edu' &&
        part !== 'ncsu' &&
        !part.startsWith('csc') &&
        !part.startsWith('dsa') &&
        !part.startsWith('wolf') &&
        !part.startsWith('ps')
    );
    return parts.join('/');
}

/**
 * Recursively gathers all supported files in a project directory and its subdirectories.
 * @param {string} projectDir - The absolute path to the project directory
 * @param {string} baseDir - The root directory for relative path calculation (defaults to projectDir)
 * @returns {Array<Object>} - Array of file objects with cleaned name and web path
 */
function gatherFiles(projectDir, baseDir = projectDir) {
    let fileList = [];
    const files = fs.readdirSync(projectDir);

    files.forEach(file => {
        const fullPath = path.join(projectDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            // Recurse into subdirectories, always passing the original baseDir
            fileList = fileList.concat(gatherFiles(fullPath, baseDir));
        } else if (SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext))) {
            fileList.push({
                // Show the path relative to the project root, but strip common folders from the start
                name: stripCommonFolders(path.relative(baseDir, fullPath).replace(/\\/g, '/')),
                // Web-friendly path for fetching the file
                path: fullPath.replace(PROJECTS_DIR, '/projects').replace(/\\/g, '/')
            });
        }
    });

    return fileList;
}

/**
 * Builds the collections and independent projects structure for the output JSON.
 * - Folders with a dash in their name are treated as collections (containing multiple projects)
 * - Other folders are treated as independent projects
 * @returns {Array<Object>} - Array of collection and project objects
 */
function buildCollections() {
    const collections = [];
    const topFiles = fs.readdirSync(PROJECTS_DIR);

    topFiles.forEach(folderName => {
        const topFileDir = path.join(PROJECTS_DIR, folderName);
        if (fs.statSync(topFileDir).isDirectory()) {
            if (folderName.includes('-')) {
                // This is a collection of multiple projects.
                const collection = { collection: folderName, projects: [] };
                const collectionProjects = fs.readdirSync(topFileDir);
                collectionProjects.forEach(projectName => {
                    const projectDir = path.join(topFileDir, projectName);
                    if (fs.statSync(projectDir).isDirectory()) {
                        collection.projects.push({
                            name: projectName,
                            files: gatherFiles(projectDir)
                        });
                    }
                });
                collections.push(collection);
            } else {
                // This is a single project (not part of a named collection).
                collections.push({
                    collection: null,
                    projects: [{
                        name: folderName,
                        files: gatherFiles(topFileDir)
                    }]
                });
            }
        }
    });
    return collections;
}

/**
 * Main function to build the JSON and write it to disk.
 */
function main() {
    const collections = buildCollections();
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collections, null, 2));
    console.log(`Generated ${OUTPUT_FILE}`);
}

main();