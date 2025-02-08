const API_URL = "http://localhost:5000/users"; // Change this to your actual API URL when needed

// ✅ Function to log in the user
async function loginUser(event) {
    event.preventDefault();
    console.log("Login function triggered");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("Entered Email:", email);
    console.log("Entered Password:", password);

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?email=${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const users = await response.json();
        console.log("Fetched Users:", users);

        if (users.length === 0) {
            alert("No user found with this email.");
            return;
        }

        const user = users[0];
        console.log("Matched User:", user);

        // ✅ Ensure that password checking is correct
        if (password === user.password) {
            console.log("Login Successful. Storing user in localStorage...");

            // ✅ Store user info properly
            const userDataToStore = {
                id: user.id,
                username: user.username,
                email: user.email,
                chats: user.chats || {} // Ensure chats exist
            };

            localStorage.setItem("user", JSON.stringify(userDataToStore));
            console.log("User Stored in Local Storage:", JSON.parse(localStorage.getItem("user")));
            
            window.location.href = "profile.html"; // Redirect to profile page
        } else {
            alert("Invalid password. Please try again.");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("Login Error: " + error.message);
    }
}

// ✅ Attach the login function to the login form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});

// ✅ Function to register a new user
async function registerUser(event) {
    event.preventDefault(); // Stop form submission

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const userData = {
            username: username,
            email: email,
            password: password, // No hashing for localhost testing
            chats: {} // ✅ Ensure new users start with an empty chat log
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Registration failed: ${response.statusText}\n${errorText}`);
        }

        alert("Account successfully created. Redirecting to login...");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Registration Error:", error.message);
        alert("Registration Error: " + error.message);
    }
}

// ✅ Function to log out the user
function logoutUser(event) {
    event.preventDefault(); // Prevent default link behavior
    console.log("Logout button clicked");

    // ✅ Remove user from storage properly
    localStorage.removeItem("user");

    console.log("User removed from localStorage");

    // Redirect to login page
    window.location.href = "login.html";
}

// ✅ Attach logout function to the logout button
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logoutUser);
    }
});
