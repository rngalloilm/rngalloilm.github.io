// Check authentication state on page load
function checkAuth() {
    fetch('/api/users/current', {
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.user && window.location.pathname === '/login') {
            window.location.href = '/';
        } else if (data && data.user) {
            displayUserInfo(data.user);
        }
    });
}

// Display user info on the page
function displayUserInfo(user) {
    if (document.getElementById('username')) {
        document.getElementById('username').textContent = `@${user.username}`;
    }
    if (document.getElementById('fullname')) {
        document.getElementById('fullname').textContent = `${user.first_name} ${user.last_name}`;
    }
    if (document.getElementById('avatar')) {
        document.getElementById('avatar').src = user.avatar;
    }
}

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(() => {
                window.location.href = '/';
            })
            .catch(err => {
                document.getElementById('error').textContent = err.error || 'Login failed';
            });
        });
    }
}

// Setup logout button
function setupLogout() {
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(() => {
                window.location.href = '/login';
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupLoginForm();
    setupLogout();
});