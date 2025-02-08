document.addEventListener("DOMContentLoaded", function() {
    // Get the product ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Get the 'id' parameter

    if (productId) {
        // Fetch the product details
        fetchProductDetails(productId);
    } else {
        console.error('Product ID not found.');
    }
});

// Function to fetch the product details based on the product ID
async function fetchProductDetails(productId) {
    try {
        const response = await fetch("db.json");  // Fetch the local db.json
        const data = await response.json();

        // Find the product by ID in the listings
        const product = data.listing.find(item => item.id === productId);

        if (product) {
            displayProductDetails(product);  // Call function to display the details
        } else {
            console.error('Product not found.');
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Function to display the product details dynamically
function displayProductDetails(product) {
    // Get the elements
    const titleElement = document.getElementById("product-title");
    const descriptionElement = document.getElementById("product-description");
    const priceElement = document.getElementById("product-price");
    const conditionElement = document.getElementById("product-condition");
    const imageElement = document.getElementById("product-image");

    // Ensure the elements exist before trying to set content
    if (!titleElement || !descriptionElement || !priceElement || !conditionElement || !imageElement) {
        console.error('One or more required elements are missing in the HTML.');
        return;
    }

    // Update the content with the fetched product details
    titleElement.textContent = product.title || 'No title available';
    descriptionElement.textContent = product.description || 'No description available';
    priceElement.textContent = `$${product.price || '0.00'}`;
    conditionElement.textContent = `Condition: ${product.condition || 'Unknown'}`;

    // Update the product image (fallback to placeholder if missing)
    imageElement.src = product.image || 'https://via.placeholder.com/150';
    imageElement.alt = product.title || 'No image available';
}
