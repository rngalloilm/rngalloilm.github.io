import React, { useEffect } from 'react';
import '../styles/projectsStyle.css';
import '../styles/style.css';
import projects from '../script/projectFiles.json';

function ProjectsPage() {
    // useEffect runs after the component mounts, similar to DOMContentLoaded
    useEffect(() => {
        

        const projectsContainer = document.getElementById('projects');
        if (!projectsContainer) return; // Guard clause

        projectsContainer.innerHTML = ''; 

        projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project');

            const projectBtn = document.createElement('button');
            projectBtn.classList.add('dropbtn');
            projectBtn.innerText = project.name;
            projectDiv.appendChild(projectBtn);

            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');
            dropdownContent.style.height = '0px';

            project.files.forEach(file => {
                const fileDiv = document.createElement('div');
                const fileBtn = document.createElement('button');
                fileBtn.classList.add('dropbtn');
                fileBtn.innerText = file.name;

                let isContentVisible = false;
                let codeBlock;

                fileBtn.addEventListener('click', () => {
                    if (!isContentVisible) {
                        // NOTE: The 'fetch' path might need adjustment for GitHub Pages.
                        // It should be relative to the deployed index.html.
                        // If your 'projects' folder is at the root of your repo, this should work.
                        fetch(file.path)
                            .then(response => response.text())
                            .then(data => {
                                codeBlock = document.createElement('pre');
                                codeBlock.innerText = data;
                                fileDiv.appendChild(codeBlock);
                                isContentVisible = true;
                                dropdownContent.style.height = dropdownContent.scrollHeight + 'px';
                            });
                    } else {
                        if (codeBlock) {
                            fileDiv.removeChild(codeBlock);
                        }
                        isContentVisible = false;
                        dropdownContent.style.height = 'auto';
                        setTimeout(() => {
                            dropdownContent.style.height = dropdownContent.scrollHeight + 'px';
                        }, 0);
                    }
                });

                fileDiv.appendChild(fileBtn);
                dropdownContent.appendChild(fileDiv);
            });

            projectBtn.addEventListener('click', () => {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                    dropdownContent.style.height = '0px';
                } else {
                    dropdownContent.classList.add('show');
                    dropdownContent.style.height = dropdownContent.scrollHeight + 'px';
                }
            });

            projectDiv.appendChild(dropdownContent);
            projectsContainer.appendChild(projectDiv);
        });
    }, []); // The empty array [] means this effect runs only once

    return (
        <main className="projects">
            <h1 className="projects-title">CSC Coding Projects</h1>
            <div id="projects">
                {/* Project buttons and code will be injected here by the useEffect hook */}
            </div>
        </main>
    );
}

export default ProjectsPage;