// Stores the restaurant information used by the recommendation form

const restaurants = [
    { id: "moby", name: "Moby 3143", cuisine: "Modern brunch cafe", deposit: 10, price: 35, diet: "Vegetarian", purpose: "Friends", budget: "Medium" },
    { id: "flovie", name: "Flovie Florist Cafe", cuisine: "Floral Asian brunch", deposit: 10, price: 35, diet: "Vegetarian", purpose: "Date", budget: "Medium" },
    { id: "lune", name: "Lune Croissanterie", cuisine: "Bakery cafe", deposit: 5, price: 25, diet: "None", purpose: "Date", budget: "Low" },
    { id: "kettle", name: "The Kettle Black", cuisine: "Modern Australian brunch", deposit: 10, price: 35, diet: "Vegetarian", purpose: "Family", budget: "Medium" },
    { id: "higher", name: "Higher Ground", cuisine: "Modern Australian", deposit: 15, price: 45, diet: "Vegetarian", purpose: "Business", budget: "High" },
    { id: "funghi", name: "Funghi e Tartufo", cuisine: "Vegan Italian", deposit: 15, price: 55, diet: "Vegan", purpose: "Date", budget: "High" },
];

// Short helper function to get an element by its id

function $(id) {
    return document.getElementById(id);
}

// Shows an error message beside a form field

function showError(id, message) {
    if ($(id)) {
        $(id).textContent = message;
    }
}

// Clears all old error messages before checking the form again

function clearErrors() {
    document.querySelectorAll(".error").forEach(error => error.textContent = "");
}

// Checks if the email has a valid format

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Runs this code only on the recommendation page

if ($("recommendForm")) {
    $("recommendForm").addEventListener("submit", function(event) {
        clearErrors();
        event.preventDefault();

        // Gets the choices selected by the user

        const diet = $("diet").value;
        const budget = $("budget").value;
        const purpose = $("purpose").value;

        // Finds restaurants that match all selected preferences

        let matches = restaurants.filter(place =>
            (diet === "Any" || place.diet === diet || place.diet === "None") &&
            place.budget === budget &&
            place.purpose === purpose
        );

        // If there is no exact match, find a close match instead

        if (matches.length === 0) {
            matches = restaurants.filter(place =>
                place.budget === budget || place.diet === diet || place.purpose === purpose
            );
        }

        // Displays the first matching restaurant on the page

        const place = matches[0];

        $("recommendResult").innerHTML = `
            <h3>${place.name}</h3>
            <p><strong>Cuisine:</strong> ${place.cuisine}</p>
            <p>This match was chosen from your diet, budget and dining purpose.</p>
            <a class="button" href="reservationprac1.html?restaurant=${place.id}">Reserve this restaurant</a>
        `;
    });
}

// Runs this code only on the registration page
if ($("registerForm")) {
    $("registerForm").addEventListener("submit", function(event) {
        clearErrors();
        let valid = true;

        const username = $("username").value.trim();
        const email = $("email").value.trim();
        const phone = $("phone").value.trim();
        const password = $("password").value;
        const confirmPassword = $("confirmPassword").value;

        if (!/^[A-Za-z0-9_]{5,}$/.test(username)) {
            showError("usernameError", "Use 5+ letters, numbers or underscores.");
            valid = false;
        }

        if (!isEmail(email)) {
            showError("emailError", "Enter a valid email.");
            valid = false;
        }

        if (!/^\d{8,15}$/.test(phone)) {
            showError("phoneError", "Phone must be 8-15 digits.");
            valid = false;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password)) {
            showError("passwordError", "Use 10+ characters with uppercase, lowercase, number and symbol.");
            valid = false;
        }

        if (password !== confirmPassword) {
            showError("confirmError", "Passwords must match.");
            valid = false;
        }

        if (!document.querySelector("input[name='gender']:checked")) {
            showError("genderError", "Select a gender.");
            valid = false;
        }

        if (!document.querySelector("input[name='diet']:checked")) {
            showError("dietError", "Select at least one dietary preference.");
            valid = false;
        }

        if ($("country").value === "") {
            showError("countryError", "Select a country/region.");
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });
}