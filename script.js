document.addEventListener("DOMContentLoaded", function() {
    // Delay the setup of event listeners to ensure the DOM is fully loaded
    setTimeout(() => {
        const searchBar = document.getElementById("searchBar");
        const searchBtn = document.getElementById("search-btn");
        const listingsContainer = document.getElementById("featured-listings-container");

        // Get the condition buttons and the clear filter button
        const conditionButtons = document.querySelectorAll('.condition-btn'); // Condition buttons
        const clearFilterBtn = document.getElementById("clear-filters"); // Clear filter button
        
        let selectedCondition = ''; // Initialize selected condition as empty string

        // Log elements to verify they are loaded
        console.log("Search Bar:", searchBar);
        console.log("Search Button:", searchBtn);
        console.log("Listings Container:", listingsContainer);

        // If any element is missing, log an error
        if (!searchBar || !searchBtn || !listingsContainer || !clearFilterBtn) {
            console.error("Required elements not found!");
            return;
        }

        // Search Button Click Event
        searchBtn.addEventListener("click", function() {
            const query = searchBar.value.toLowerCase();
            console.log("Search Query on Button Click:", query); // Log the query when clicked
            fetchListings(query, selectedCondition); // Fetch listings with condition filter
        });

        // Condition Button Click Event (Filter by condition)
        conditionButtons.forEach(button => {
            button.addEventListener('click', function() {
                selectedCondition = this.innerText; // Set selected condition based on clicked button
                highlightSelectedCondition(button);
            });
        });

        // Clear Filters Button Click Event
        clearFilterBtn.addEventListener("click", function() {
            // Reset condition filter to default
            selectedCondition = '';
            conditionButtons.forEach(button => button.classList.remove('selected')); // Remove all selected condition styles
            fetchListings(searchBar.value.toLowerCase(), ''); // Re-fetch listings without filters
        });

        // Initial fetch for featured listings
        fetchFeaturedListings();
    }, 500); // Delay by 500ms
});

// Fetch Listings Based on Search Query and Condition
async function fetchListings(query, selectedCondition) {
    if (!query) {
        console.error("Search query is empty.");
        return;
    }

    console.log("Search Query:", query);
    console.log("Selected Condition:", selectedCondition);

    try {
        const response = await fetch("db.json"); // Fetch the local db.json
        const listings = await response.json();

        // Filter the listings by matching the title with the query and condition
        const filteredListings = listings.listing.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
            const matchesCondition = selectedCondition ? item.condition.toLowerCase() === selectedCondition.toLowerCase() : true;

            return matchesQuery && matchesCondition;
        });

        displaySearchResults(filteredListings);
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// Display Search Results
function displaySearchResults(listings) {
    const resultsContainer = document.getElementById("search-results-container");
    resultsContainer.innerHTML = ""; // Clear previous results


    if (listings.length === 0) {
        resultsContainer.innerHTML = "<p>No items found based on your search and filters.</p>";
        return;
    }


    listings.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("listing");


        // Create a clickable link that redirects to productview.html with the product ID in the URL
        itemElement.innerHTML = `
            <a href="productview.html?id=${item.id}" class="listing-link">
                <img src="${item.image ? item.image : 'https://via.placeholder.com/150'}"
                     alt="${item.title}"
                     onerror="this.src='https://via.placeholder.com/150';" />
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span>Price: $${item.price}</span>
                <span>Condition: ${item.condition}</span>
            </a>
        `;
       
        resultsContainer.appendChild(itemElement);
    });
}




// Highlight selected condition button
function highlightSelectedCondition(selected) {
    const buttons = document.querySelectorAll('.condition-btn');
    buttons.forEach(button => button.classList.remove('selected')); // Remove previous selections
    selected.classList.add('selected'); // Highlight current selection
}


// Fetch Featured Listings
async function fetchFeaturedListings() {
    try {
        const response = await fetch("db.json");
        const listings = await response.json();
        const listingsContainer = document.querySelector('#featured-listings-container');


        if (!listingsContainer) {
            console.error("Error: Listings container not found.");
            return;
        }


        if (!listings || listings.length === 0) {
            listingsContainer.innerHTML = '<p>No featured listings available.</p>';
            return;
        }


        listingsContainer.innerHTML = listings.listing.map((listing) => `
            <div class="listing">
                <a href="productview.html?id=${listing.id}" class="listing-link">
                    <img src="${listing.image ? listing.image : 'https://via.placeholder.com/150'}"
                         alt="${listing.title}"
                         onerror="this.src='https://via.placeholder.com/150';" />
                    <h3>${listing.title}</h3>
                    <p>${listing.description}</p>
                    <span>Price: $${listing.price}</span>
                    <span>Condition: ${listing.condition}</span>
                </a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching featured listings:', error);
        alert('Failed to load featured listings.');
    }
}

