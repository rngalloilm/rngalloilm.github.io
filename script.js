document.addEventListener('DOMContentLoaded', function () {
    const projects = [
        // Define your projects here with their files
        {
            name: "Project 1",
            files: [
                {
                    name: "File 1",
                    path: "projects/project1/file1.c"
                },
                {
                    name: "File 2",
                    path: "projects/project1/file2.java"
                }
            ]
        },
        // Add more projects here
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

        project.files.forEach(file => {
            const fileBtn = document.createElement('button');
            fileBtn.classList.add('dropbtn');
            fileBtn.innerText = file.name;
            fileBtn.addEventListener('click', () => {
                fetch(file.path)
                    .then(response => response.text())
                    .then(data => {
                        const codeBlock = document.createElement('pre');
                        codeBlock.innerText = data;
                        dropdownContent.appendChild(codeBlock);
                    });
            });
            dropdownContent.appendChild(fileBtn);
        });

        projectBtn.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });

        projectDiv.appendChild(dropdownContent);
        projectsContainer.appendChild(projectDiv);
    });
});
