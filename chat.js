const API_URL = "http://localhost:5000"; // Update if necessary

// Get logged-in user
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (!loggedInUser) {
    alert("Please log in to access chats.");
    window.location.href = "login.html";
}

let selectedChatUser = null; // Track the selected chat user

async function loadChatList() {
    try {
        const response = await fetch(`${API_URL}/users/${loggedInUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        const chatListContainer = document.querySelector(".chat-list");
        chatListContainer.innerHTML = ""; // Clear previous chat list

        if (!userData.chats || Object.keys(userData.chats).length === 0) {
            chatListContainer.innerHTML = "<p>No chats available.</p>";
            return;
        }

        Object.keys(userData.chats).forEach(contact => {
            const chatItem = document.createElement("li");
            chatItem.className = "chat-item";
            chatItem.setAttribute("data-contact", contact); // Store contact info
            chatItem.innerHTML = `
                <div class="chat-avatar"></div>
                <div class="chat-info">
                    <strong>${contact}</strong>
                    <p>${userData.chats[contact].slice(-1)[0]?.message || "No messages yet"}</p>
                </div>
            `;

            // Add click event to load messages for the selected chat
            chatItem.addEventListener("click", () => {
                console.log("Selected contact:", contact); // Debugging log
                loadMessages(contact);
            });

            chatListContainer.appendChild(chatItem);
        });
    } catch (error) {
        console.error("Error loading chat list:", error.message);
    }
}

// ✅ Load messages for a specific chat
async function loadMessages(contactUsername) {
    selectedChatUser = contactUsername;

    // Highlight the selected chat in the sidebar
    document.querySelectorAll(".chat-item").forEach(item => {
        item.classList.remove("active");
    });

    const selectedChatItem = document.querySelector(`.chat-item[data-contact="${contactUsername}"]`);
    if (selectedChatItem) {
        selectedChatItem.classList.add("active");
    }

    document.getElementById("chat-title").textContent = `Chat with ${contactUsername}`; // Update chat header

    try {
        const response = await fetch(`${API_URL}/users/${loggedInUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        const chatContainer = document.querySelector(".messages");

        chatContainer.innerHTML = ""; // Clear previous messages

        const messages = userData.chats[contactUsername] || [];
        messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.classList.add(message.sender === loggedInUser.username ? "user-message" : "system-message");
            messageElement.textContent = message.message;
            chatContainer.appendChild(messageElement);
        });

        // Scroll to latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Error loading messages:", error.message);
    }
}

// ✅ Send a new message
async function loadMessages(contactUsername) {
    selectedChatUser = contactUsername;

    // Highlight the selected chat in the sidebar
    document.querySelectorAll(".chat-item").forEach(item => {
        item.classList.remove("active");
    });

    const selectedChatItem = document.querySelector(`.chat-item[data-contact="${contactUsername}"]`);
    if (selectedChatItem) {
        selectedChatItem.classList.add("active");
    }

    document.getElementById("chat-title").textContent = `Chat with ${contactUsername}`; // Update chat header

    try {
        const response = await fetch(`${API_URL}/users/${loggedInUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        const chatContainer = document.querySelector(".messages");

        chatContainer.innerHTML = ""; // Clear previous messages

        const messages = userData.chats[contactUsername] || [];
        console.log("Messages for", contactUsername, messages); // Debugging log

        messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.classList.add(
                message.sender === loggedInUser.username ? "user-message" : "system-message"
            );
            messageElement.textContent = message.message;
            chatContainer.appendChild(messageElement);
        });

        // Scroll to latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Error loading messages:", error.message);
    }
}

// ✅ Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadChatList();

    const chatInputForm = document.querySelector(".message-form");
    if (chatInputForm) {
        chatInputForm.addEventListener("submit", sendMessage);
    }
});
