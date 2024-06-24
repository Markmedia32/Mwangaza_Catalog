document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');

    // Dummy user credentials (replace with actual authentication logic)
    const users = [
        { username: 'Markel', password: 'Mutwiri1379', name: 'Admin User' },
        { username: 'Makena', password: 'Makena2024', name: 'Admin User' },
        { username: 'Evangeline', password: 'Evangeline2024', name: 'Admin User' }
        
    ];

    // Function to handle form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Successful login, set session and redirect to profile page
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html'; // Redirect to dashboard page
        } else {
            // Failed login, display error message
            errorMessage.textContent = 'Invalid username or password.';
        }
    });

    // Check if user is already logged in (session management)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        // Redirect to dashboard if already logged in
        window.location.href = 'dashboard.html';
    }
});
