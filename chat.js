// Handle sending messages
document.querySelector(".chat-input button").addEventListener("click", function() {
    const input = document.querySelector(".chat-input input[type='text']");
    const message = input.value.trim();
    if (message) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message user";
        messageDiv.textContent = message;

        const chatMessages = document.querySelector(".chat-messages");
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        input.value = ""; // Clear the input field

        // Simulate a system response
        setTimeout(() => {
            const systemMessage = document.createElement("div");
            systemMessage.className = "message system";
            systemMessage.textContent = "Thanks for your message!";
            chatMessages.appendChild(systemMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
});
