const API_URL = "http://localhost:3000"; // Update with your server URL

// Get logged-in user from localStorage
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (!loggedInUser) {
    alert("Please log in to access chats.");
    window.location.href = "login.html";
}

let selectedChatId = null; // Track the selected chat

// ✅ Load chat list for the user
async function loadChatList() {
    try {
        const response = await fetch(`${API_URL}/chats`);
        if (!response.ok) throw new Error("Failed to fetch chat list");

        const chats = await response.json();
        const chatListContainer = document.getElementById("chat-list");
        chatListContainer.innerHTML = ""; // Clear chat list

        chats.forEach(chat => {
            if (chat.participants.includes(loggedInUser.id)) {
                const otherUserId = chat.participants.find(id => id !== loggedInUser.id);
                
                fetch(`${API_URL}/users/${otherUserId}`)
                    .then(res => res.json())
                    .then(user => {
                        const chatItem = document.createElement("li");
                        chatItem.textContent = user.username;
                        chatItem.onclick = () => loadMessages(chat.id, user.username);
                        chatListContainer.appendChild(chatItem);
                    });
            }
        });
    } catch (error) {
        console.error("Error loading chat list:", error.message);
    }
}

// ✅ Load messages for a specific chat
async function loadMessages(chatId, chatTitle) {
    selectedChatId = chatId;
    document.getElementById("chat-title").textContent = chatTitle; // Update chat header

    try {
        const response = await fetch(`${API_URL}/chats/${chatId}`);
        if (!response.ok) throw new Error("Failed to fetch chat messages");

        const chatData = await response.json();
        const chatContainer = document.getElementById("chat-container");

        chatContainer.innerHTML = ""; // Clear previous messages

        chatData.messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.classList.add(message.senderId === loggedInUser.id ? "sent-message" : "received-message");
            messageElement.textContent = message.content;
            chatContainer.appendChild(messageElement);
        });

        // Scroll to the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Error loading messages:", error.message);
    }
}

// ✅ Send a new message
async function sendMessage(event) {
    event.preventDefault();

    if (!selectedChatId) {
        alert("Please select a chat first.");
        return;
    }

    const messageInput = document.getElementById("message-input");
    const newMessage = {
        senderId: loggedInUser.id,
        content: messageInput.value.trim(),
        timestamp: new Date().toISOString(),
    };

    if (!newMessage.content) return; // Prevent sending empty messages

    try {
        // Fetch the current chat
        const response = await fetch(`${API_URL}/chats/${selectedChatId}`);
        if (!response.ok) throw new Error("Failed to fetch chat for update");

        const chat = await response.json();

        // Add new message to chat
        chat.messages.push(newMessage);

        // Update chat on server
        const updateResponse = await fetch(`${API_URL}/chats/${selectedChatId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chat),
        });

        if (!updateResponse.ok) throw new Error("Failed to update chat");

        // Reload chat messages
        loadMessages(selectedChatId, document.getElementById("chat-title").textContent);

        // Clear the input field
        messageInput.value = "";
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
}

// ✅ Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadChatList();

    const chatInputForm = document.getElementById("chat-input-form");
    if (chatInputForm) {
        chatInputForm.addEventListener("submit", sendMessage);
    }
});
