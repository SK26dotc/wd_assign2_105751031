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

// Finds one restaurant from the restaurant list using its id

function getRestaurant(id) {
    return restaurants.find(place => place.id === id);
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

// Updates the deposit amount when a restaurant is selected on the reservation page

if ($("restaurantSelect")) {
    const pageInfo = new URLSearchParams(location.search);
    if (pageInfo.get("restaurant")) $("restaurantSelect").value = pageInfo.get("restaurant");

    function updateDeposit() {
        const place = getRestaurant($("restaurantSelect").value);
        $("depositAmount").value = place ? "$" + place.deposit : "";
    }

    $("restaurantSelect").addEventListener("change", updateDeposit);
    updateDeposit();
}

// Shows voucher or card details depending on the payment method

if ($("paymentMethod")) {
    function showPaymentFields() {
        $("voucherBox").classList.add("hidden");
        $("cardBox").classList.add("hidden");

        if ($("paymentMethod").value === "Voucher") $("voucherBox").classList.remove("hidden");
        if ($("paymentMethod").value === "Online") $("cardBox").classList.remove("hidden");
    }

    $("paymentMethod").addEventListener("change", showPaymentFields);
    showPaymentFields();
}

// Copies reservation email into billing email when checkbox is selected
if ($("sameEmail")) {
    $("sameEmail").addEventListener("change", function() {
        if ($("sameEmail").checked) {
            $("billingEmail").value = $("resEmail").value;
        }
    });
}

// Checks the reservation form before it is submitted
if ($("reservationForm")) {
    $("reservationForm").addEventListener("submit", function(event) {
        clearErrors();
        let valid = true;

        const method = $("paymentMethod").value;
        const card = $("cardNumber").value.trim();
        const cardType = $("cardType").value;

        if ($("fullName").value.trim() === "") {
            showError("fullNameError", "Full name is required.");
            valid = false;
        }

        if (!isEmail($("resEmail").value.trim())) {
            showError("resEmailError", "Enter a valid email.");
            valid = false;
        }

        if (!/^\d{10,}$/.test($("resPhone").value.trim())) {
            showError("resPhoneError", "Phone needs at least 10 digits.");
            valid = false;
        }

        if ($("dateTime").value === "" || new Date($("dateTime").value) < new Date()) {
            showError("dateTimeError", "Choose a future date/time.");
            valid = false;
        }

        if (Number($("people").value) <= 0) {
            showError("peopleError", "People must be greater than 0.");
            valid = false;
        }

        if (method === "") {
            showError("paymentError", "Choose a deposit method.");
            valid = false;
        }

        if (method === "Online") {
            const requiredLength = cardType === "Amex" ? 15 : 16;
            const cardRule = new RegExp("^\\d{" + requiredLength + "}$");

            if (!cardRule.test(card)) {
                showError("cardError", cardType + " must be " + requiredLength + " digits.");
                valid = false;
            }
        }

        if (!valid) {
            event.preventDefault();
        }
    });
}

// Updates the estimated bill on the billing page when options are changed

if ($("billForm")) {
    function updateBill() {
        const place = getRestaurant($("billRestaurant").value);
        const guests = Number($("billGuests").value);
        const desserts = Number($("dessertCount").value);
        const drinks = Number($("drinkCount").value);
        const total = (place.price * guests) + (desserts * 9) + (drinks * 6);

        $("billResult").textContent = "Estimated total: $" + total.toFixed(2);
    }

    $("billForm").addEventListener("input", updateBill);
    updateBill();
}
