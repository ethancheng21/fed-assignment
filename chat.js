const API_URL = "http://localhost:3000"; // Update if necessary

// Get logged-in user
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (!loggedInUser) {
    alert("Please log in to access chats.");
    window.location.href = "login.html";
}

let selectedChatUser = null; // Track the selected chat user

// ✅ Load chat list for the user
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
            chatItem.innerHTML = `
                <div class="chat-avatar"></div>
                <div class="chat-info">
                    <strong>${contact}</strong>
                    <p>Last message...</p>
                </div>
            `;
            chatItem.onclick = () => loadMessages(contact);
            chatListContainer.appendChild(chatItem);
        });
    } catch (error) {
        console.error("Error loading chat list:", error.message);
    }
}

// ✅ Load messages for a specific chat
async function loadMessages(contactUsername) {
    selectedChatUser = contactUsername;
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
async function sendMessage(event) {
    event.preventDefault();

    if (!selectedChatUser) {
        alert("Please select a chat first.");
        return;
    }

    const messageInput = document.getElementById("message-input");
    const newMessage = {
        sender: loggedInUser.username,
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString(),
    };

    if (!newMessage.message) return; // Prevent empty messages

    try {
        // Fetch the current user data
        const response = await fetch(`${API_URL}/users/${loggedInUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        let userData = await response.json();

        // Add the message to both sender and recipient chat histories
        if (!userData.chats[selectedChatUser]) {
            userData.chats[selectedChatUser] = [];
        }
        userData.chats[selectedChatUser].push(newMessage);

        const recipientResponse = await fetch(`${API_URL}/users`);
        const allUsers = await recipientResponse.json();
        const recipient = allUsers.find(user => user.username === selectedChatUser);
        if (!recipient) throw new Error("Recipient not found");

        if (!recipient.chats[loggedInUser.username]) {
            recipient.chats[loggedInUser.username] = [];
        }
        recipient.chats[loggedInUser.username].push(newMessage);

        // Update the sender's chat data
        await fetch(`${API_URL}/users/${loggedInUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        // Update the recipient's chat data
        await fetch(`${API_URL}/users/${recipient.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipient),
        });

        // Reload chat messages
        loadMessages(selectedChatUser);

        // Clear input field
        messageInput.value = "";
    } catch (error) {
        console.error("Error sending message:", error.message);
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
