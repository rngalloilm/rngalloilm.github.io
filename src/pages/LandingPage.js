import React, { useEffect } from 'react';
import '../styles/landingStyle.css';
import '../styles/style.css';

function LandingPage() {
    // useEffect runs after the component mounts, similar to DOMContentLoaded
    useEffect(() => {
        const projects = [
            // C Projects
            {
                name: "C - P2: List Formatting",
                files: [
                    {
                        name: "formatter.c",
                        path: "projects/P2/formatter.c"
                    },
                    {
                        name: "date.c",
                        path: "projects/P2/date.c"
                    },
                    {
                        name: "date.h",
                        path: "projects/P2/date.h"
                    },
                    {
                        name: "name.c",
                        path: "projects/P2/name.c"
                    },
                    {
                        name: "name.h",
                        path: "projects/P2/name.h"
                    },
                    {
                        name: "ssn.c",
                        path: "projects/P2/ssn.c"
                    },
                    {
                        name: "ssn.h",
                        path: "projects/P2/ssn.h"
                    },
                    {
                        name: "util.c",
                        path: "projects/P2/util.c"
                    },
                    {
                        name: "util.h",
                        path: "projects/P2/util.h"
                    }
                ]
            },
            {
                name: "C - P3: Stocks",
                files: [
                    {
                        name: "trader.c",
                        path: "projects/P3/trader.c"
                    },
                    {
                        name: "transaction.c",
                        path: "projects/P3/transaction.c"
                    },
                    {
                        name: "transaction.h",
                        path: "projects/P3/transaction.h"
                    },
                    {
                        name: "account.c",
                        path: "projects/P3/account.c"
                    },
                    {
                        name: "account.h",
                        path: "projects/P3/account.h"
                    },
                    {
                        name: "util.c",
                        path: "projects/P3/util.c"
                    },
                    {
                        name: "util.h",
                        path: "projects/P3/util.h"
                    }
                ]
            },
            {
                name: "C - P4: Trip",
                files: [
                    {
                        name: "parks.c",
                        path: "projects/P4/parks.c"
                    },
                    {
                        name: "catalog.c",
                        path: "projects/P4/catalog.c"
                    },
                    {
                        name: "catalog.h",
                        path: "projects/P4/catalog.h"
                    }
                ]
            },
            {
                name: "C - HW3.2: Max Palindrome",
                files: [
                    {
                        name: "maxpalindrome-thread.c",
                        path: "projects/HW3.2/maxpalindrome-thread.c"
                    }
                ]
            }
        ];

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
        <main className="landing">
            <h1 className="landing-title">CSC Coding Projects</h1>
            <div id="projects">
                {/* Project buttons and code will be injected here by the useEffect hook */}
            </div>
        </main>
    );
}

export default LandingPage;