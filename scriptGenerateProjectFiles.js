const fs = require('fs');
const path = require('path');

// Set the projects directory and output file.
// __dirname is C:\Users\NicholasGallo\Documents\rngalloilm.github.io
const PROJECTS_DIR = path.join(__dirname, 'public', 'projects');
const OUTPUT_FILE = path.join(__dirname, 'src/script', 'projectFiles.json');

// Iterate through the projects and gather.
function walkDir(dir, fileList = []) {
    // Read the contents of the directory and return an array of the names of files and subdirectories inside that directory.
    // dir /Projects so topFiles is an array of collections.
    const topFiles = fs.readdirSync(dir);

    // File names with a dash '-' contain more projects.
    topFiles.forEach(folderName => {
        // Path string that points to the file or subdirectory inside dir.
        // If dir is /home/user/projects and folderName is C-ProblemSets, then fileDir will be /home/user/projects/C-ProblemSets.
        const fileDir = path.join(dir, folderName);

        // Verify directory.
        const stat = fs.statSync(fileDir);
        if (stat.isDirectory()) {
            // Check if the folder is a collection of projects.
            if (folderName.includes('-')) {
                // Get the array of files in a collection's folder.
                const collectionDir = fileDir;
                const collectionProjects = fs.readdirSync(collectionDir);

                collectionProjects.forEach(projectName => {
                    // file /home/user/projects/C-ProblemSets, collectionFile /P2 -> /home/user/projects/C-ProblemSets/P2.
                    const projectPath = path.join(collectionDir, projectName);

                    if (fs.statSync(projectPath).isDirectory()) {
                        // Now gather the files in this project.
                        gatherFilesC(projectPath, fileList);
                    }
                });
            } else {
                // This is a single project folder.
                gatherFilesC(fileDir, fileList);
            }
        }
    });
    return fileList;
}

// Extract the files in a C project folder.
function gatherFilesC(projectDir, fileList) {
    // Array of files in project
    const files = fs.readdirSync(projectDir);

    // Check the end of each file for .c and .h
    files.forEach(file => {
        if (file.endsWith('.c') || file.endsWith('.h')) {
            fileList.push({
                name: file,
                path: projectDir.replace(PROJECTS_DIR, '/projects').replace(/\\/g, '/') + '/' + file
            });
        }
    });
}

// Organize the files extracted from all projects.
function groupByProject(files) {
    const projects = {};

    files.forEach(file => {
        // Extract project name from path, e.g., /projects/P2/formatter.c -> P2
        const match = file.path.match(/^\/projects\/([^/]+)/);

        if (match) {
            // /projects/P2/formatter.c -> P2
            const project = match[1];
            // Checks if the projects object already has an array for this project name.
            if (!projects[project]) projects[project] = [];
            projects[project].push(file);
        }
    });

    // Convert to array of { name, files }
    return Object.entries(projects).map(([name, files]) => ({
        name: `C - ${name}`,
        files
    }));
}

function main() {
    // Get the files.
    const files = walkDir(PROJECTS_DIR);
    // Organize the files.
    const projects = groupByProject(files);
    // Output the JSON to OUTPUT_FILE
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    
    console.log(`Generated ${OUTPUT_FILE}`);
}

main();