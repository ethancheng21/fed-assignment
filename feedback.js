document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the user input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Create an object to store feedback data
    const feedbackData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString() // Add a timestamp for when the feedback was submitted
    };

    // Save the feedback data in local storage (you can store all feedback or a single one)
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || []; // Get existing feedback or initialize an empty array
    feedbacks.push(feedbackData); // Add the new feedback to the array
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks)); // Store updated array back to local storage

    // Show confirmation message
    document.getElementById("responseMessage").style.display = "block";
    document.getElementById("responseMessage").innerText = "Your feedback has been saved. We will get back to you soon. Please check your email.";

    // Optionally, clear the form after submission
    document.getElementById("feedbackForm").reset();
});
