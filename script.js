document.addEventListener('DOMContentLoaded', function () {

    // Define your projects here with their files
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

    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectBtn = document.createElement('button');
        projectBtn.classList.add('dropbtn');
        projectBtn.innerText = project.name;
        projectDiv.appendChild(projectBtn);

        const dropdownContent = document.createElement('div');
        dropdownContent.classList.add('dropdown-content');
        dropdownContent.style.height = '0px'; // Initially hidden

        project.files.forEach(file => {
            const fileDiv = document.createElement('div');
            const fileBtn = document.createElement('button');
            fileBtn.classList.add('dropbtn');
            fileBtn.innerText = file.name;

            let isContentVisible = false;
            let codeBlock;

            fileBtn.addEventListener('click', () => {
                if (!isContentVisible) {
                    fetch(file.path)
                        .then(response => response.text())
                        .then(data => {
                            codeBlock = document.createElement('pre');
                            codeBlock.innerText = data;
                            fileDiv.appendChild(codeBlock);
                            isContentVisible = true;

                            // Ensure the dropdown height grows after adding content
                            dropdownContent.style.height = dropdownContent.scrollHeight + 'px';
                        });
                } else {
                    fileDiv.removeChild(codeBlock);
                    isContentVisible = false;

                    // Force height recalculation after removing content
                    dropdownContent.style.height = 'auto'; // Set height to auto for proper calculation
                    setTimeout(() => {
                        dropdownContent.style.height = dropdownContent.scrollHeight + 'px'; // Set exact height after removal
                    }, 0); // No delay is needed, recalculate immediately
                }
            });

            fileDiv.appendChild(fileBtn);
            dropdownContent.appendChild(fileDiv);
        });

        projectBtn.addEventListener('click', () => {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                dropdownContent.style.height = '0px'; // Collapse the drop-down
            } else {
                dropdownContent.classList.add('show');
                dropdownContent.style.height = dropdownContent.scrollHeight + 'px'; // Expand the drop-down
            }
        });

        projectDiv.appendChild(dropdownContent);
        projectsContainer.appendChild(projectDiv);
    });
});