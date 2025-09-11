// Import required modules
const fs = require('fs');
const path = require('path');

// List of supported file extensions and names to include in the project file listing
const SUPPORTED_EXTENSIONS = [
  '.c', '.h', '.java', '.html', '.css', '.js', '.json', '.jsx', '.md', '.conf',
  'Dockerfile', '.yml', '.sh', '.xml', '.pem', '.sql'
];

// Define paths relative to the script's location
const BASE_DIR = __dirname;
const PROJECTS_DIR = path.join(BASE_DIR, 'public', 'projects');
const PUBLIC_DIR = path.join(BASE_DIR, 'public');
const OUTPUT_FILE = path.join(BASE_DIR, 'src', 'script', 'projectFiles.json');

/**
 * Removes common/unwanted directory segments from a relative file path.
 */
function stripCommonFolders(relPath) {
    let parts = relPath.split('/');
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
 * Recursively gathers all supported files in a project directory.
 */
function gatherFiles(projectDir, baseDir = projectDir) {
    let fileList = [];
    if (!fs.existsSync(projectDir)) {
        console.warn(`Warning: Directory not found, skipping: ${projectDir}`);
        return [];
    }
    const files = fs.readdirSync(projectDir);

    files.forEach(file => {
        if (file === 'node_modules') {
            return; // Skip node_modules
        }

        const fullPath = path.join(projectDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            fileList = fileList.concat(gatherFiles(fullPath, baseDir));
        } else if (SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext) || file === ext)) {
            // --- THIS IS THE CORRECTED PART ---
            // Create a web-accessible relative path from the /public directory
            const webPath = '/' + path.relative(PUBLIC_DIR, fullPath).replace(/\\/g, '/');
            
            fileList.push({
                name: stripCommonFolders(path.relative(baseDir, fullPath).replace(/\\/g, '/')),
                path: webPath 
            });
        }
    });

    return fileList;
}

/**
 * Builds the collections and independent projects structure.
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
                // This is a single project.
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
    console.log("Generating project files...");
    const collections = buildCollections();
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collections, null, 2));
    console.log(`Generated ${OUTPUT_FILE}`);
}

main();