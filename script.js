
/* =================================
   CAFESTAGE - JAVASCRIPT
================================= */

// Check if JavaScript is connected

console.log("Welcome to Cafestage!");


// Save visitor information

function saveVisitor(name) {

    sessionStorage.setItem(
        "visitorName",
        name
    );

}


// Retrieve visitor information

function getVisitor() {

    return sessionStorage.getItem(
        "visitorName"
    );

}



// Choose how to visit Cafestage

function chooseVisit(type) {

    sessionStorage.setItem("visitType", type);

    const area = document.getElementById("reservation-area");

    if (type === "Walk-in") {

        area.innerHTML = `
            <h3>Walk-in selected!</h3>
            <p>Let's find you a seat.</p>
            <a href="seats.html" class="enter-button">
                Choose Your Table
            </a>
        `;

    } else {

        area.innerHTML = `
            <h3>Make a Reservation</h3>

            <label>Your Name:</label>
            <input type="text" id="guest-name"
                placeholder="Enter your name">

            <br><br>

            <label>Number of Guests:</label>
            <input type="number" id="guest-count"
                min="1" max="10" value="2">

            <br><br>

            <button onclick="submitReservation()">
                Continue
            </button>
        `;
    }
}


// Save reservation details

function submitReservation() {

    const name = document.getElementById("guest-name").value;
    const guests = document.getElementById("guest-count").value;

    if (name.trim() === "" || guests < 1 || guests > 10) {
        alert("Please enter a valid name and number of guests.");
        return;
    }

    sessionStorage.setItem("visitorName", name);
    sessionStorage.setItem("guestCount", guests);

    window.location.href = "seats.html";
}



// Select a table

function selectTable(tableName) {

    sessionStorage.setItem("selectedTable", tableName);

    const area = document.getElementById("selected-table");

    area.innerHTML = `
        <h3>You selected ${tableName}!</h3>

        <img
            src="images/counter.png"
            alt="Cafestage counter"
            style="width:180px; max-width:80%;"
        >

        <p>Your seat is ready. Time to explore the menu!</p>

        <button onclick="goToMenu()">
            Order Now
        </button>
    `;

}


// Continue to menu

function goToMenu() {
    window.location.href = "menu.html";
}


/* =========================
   CAFESTAGE MENU SYSTEM
========================= */

// Menu products

const drinks = [
    { id: "D1", name: "Zebra Alienieted", price: 89, image: "D1.png", time: 30 },
    { id: "D2", name: "Iced Pumpkinieted", price: 70, image: "D2.png", time: 30 },
    { id: "D3", name: "Iced Milkinieted", price: 86, image: "D3.png", time: 30 },
    { id: "D4", name: "Iced Caramelnieted", price: 87, image: "D4.png", time: 30 },
    { id: "D5", name: "Iced Matchanieted", price: 52.80, image: "D5.png", time: 30 },
    { id: "D6", name: "Iced Kafohanieted", price: 47.20, image: "D6.png", time: 30 },
    { id: "D7", name: "Espressonieted", price: 50, image: "D7.png", time: 30 },
    { id: "D8", name: "Iced Rosienabarinieted", price: 68, image: "D8.png", time: 30 },
    { id: "D9", name: "Bobanieted", price: 68, image: "D9.png", time: 30 }
];

const snacks = [
    { id: "S1", name: "Cakeuuu", price: 51, image: "S1.png", time: 60 },
    { id: "S2", name: "Wafflenieted", price: 49, image: "S2.png", time: 60 },
    { id: "S3", name: "Cookianieted", price: 20, image: "S3.png", time: 60 },
    { id: "S4", name: "Pancakenieted", price: 153, image: "S4.png", time: 60 }
];

let cart = [];


// Display products

function displayProducts(products, containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <img
                    src="images/${product.image}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <p>₱${product.price.toFixed(2)}</p>

                <button onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>

            </div>
        `;

    });

}


// Find a product

function findProduct(id) {

    return [...drinks, ...snacks].find(product => product.id === id);

}


// Add item to cart

function addToCart(id) {

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    updateCart();

}


// Change quantity

function changeQuantity(id, amount) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);

    }

    updateCart();

}


// Update cart display

function updateCart() {

    const cartArea = document.getElementById("cart-items");

    if (!cartArea) return;

    let subtotal = 0;
    let prepTime = 0;

    cartArea.innerHTML = "";

    if (cart.length === 0) {

        cartArea.innerHTML = "<p>Your cart is empty.</p>";

    }

    cart.forEach(item => {

        const product = findProduct(item.id);

        const itemTotal = product.price * item.quantity;

        subtotal += itemTotal;
        prepTime += product.time * item.quantity;

        cartArea.innerHTML += `
            <div class="cart-item">

                <strong>${product.name}</strong>

                <p>₱${itemTotal.toFixed(2)}</p>

                <button onclick="changeQuantity('${item.id}', -1)">−</button>

                ${item.quantity}

                <button onclick="changeQuantity('${item.id}', 1)">+</button>

            </div>
        `;

    });

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("total").textContent = subtotal.toFixed(2);
    document.getElementById("prep-time").textContent = prepTime;

}


// Confirm order

function confirmOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add something first.");
        return;

    }

    const orderDetails = cart.map(item => {

        const product = findProduct(item.id);

        return {
            id: item.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.image,
            time: product.time
        };

    });

    const total = cart.reduce((sum, item) => {

        const product = findProduct(item.id);

        return sum + product.price * item.quantity;

    }, 0);

    const prepTime = cart.reduce((sum, item) => {

        const product = findProduct(item.id);

        return sum + product.time * item.quantity;

    }, 0);

    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    sessionStorage.setItem("orderTotal", total.toFixed(2));
    sessionStorage.setItem("prepTime", prepTime);
    sessionStorage.setItem("orderDate", new Date().toLocaleString());

    window.location.href = "waiting.html";

}


// Load menu when menu page opens

if (document.getElementById("drink-list")) {

    displayProducts(drinks, "drink-list");
    displayProducts(snacks, "snack-list");

    updateCart();

}


/* =========================
   WAITING PAGE SYSTEM
========================= */

// Trivia questions

const triviaQuestions = [

    {
        question: "What is the smallest prime number?",
        options: ["1", "3", "2", "5"],
        answer: "2"
    },

    {
        question: "Which gas is most abundant in Earth's atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        answer: "Nitrogen"
    },

    {
        question: "Who was the first person to walk on the Moon?",
        options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
        answer: "Neil Armstrong"
    },

    {
        question: "What is the main ingredient in guacamole?",
        options: ["Cucumber", "Avocado", "Lettuce", "Tomato"],
        answer: "Avocado"
    },

    {
        question: "What instrument is used to measure earthquakes?",
        options: ["Thermometer", "Barometer", "Seismograph", "Hygrometer"],
        answer: "Seismograph"
    },

    {
        question: "What is the tallest mountain in the world?",
        options: ["Kilimanjaro", "Everest", "K2", "Mount Fuji"],
        answer: "Everest"
    },

    {
        question: "Which bird is a universal symbol of peace?",
        options: ["Eagle", "Sparrow", "Dove", "Owl"],
        answer: "Dove"
    },

    {
        question: "At what temperature does water boil in Fahrenheit at sea level?",
        options: ["100°F", "180°F", "212°F", "220°F"],
        answer: "212°F"
    },

    {
        question: "Who painted The Starry Night?",
        options: ["Pablo Picasso", "Leonardo da Vinci", "Claude Monet", "Vincent van Gogh"],
        answer: "Vincent van Gogh"
    },

    {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
        answer: "Mercury"
    },

    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        answer: "Blue Whale"
    },

    {
        question: "Which element has the symbol O?",
        options: ["Gold", "Oxygen", "Osmium", "Iron"],
        answer: "Oxygen"
    },

    {
        question: "How many legs does a spider have?",
        options: ["6", "10", "8", "12"],
        answer: "8"
    },

    {
        question: "Who is commonly credited with inventing the telephone?",
        options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Benjamin Franklin"],
        answer: "Alexander Graham Bell"
    },

    {
        question: "What is the capital of France?",
        options: ["Rome", "Madrid", "Berlin", "Paris"],
        answer: "Paris"
    },

    {
        question: "What process do plants use to make their food?",
        options: ["Respiration", "Fermentation", "Photosynthesis", "Transpiration"],
        answer: "Photosynthesis"
    },

    {
        question: "Which planet has the most confirmed moons according to current astronomical counts?",
        options: ["Jupiter", "Neptune", "Saturn", "Uranus"],
        answer: "Saturn"
    },

    {
        question: "Which song does Ivan sing in Alien Stage Round 3?",
        options: ["All-In", "Wiege", "Sweet Dream", "Black Sorrow"],
        answer: "Black Sorrow"
    }

];


// Countdown variables

let remainingTime = Number(sessionStorage.getItem("prepTime")) || 0;

let countdownInterval = null;
let triviaActive = false;
let triviaScore = 0;
let currentQuestion = 0;
let questionList = [];


// Display countdown

function updateCountdown() {

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const display =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    const countdown = document.getElementById("countdown");

    if (countdown) {
        countdown.textContent = display;
    }

}


// Start countdown

function startCountdown() {

    updateCountdown();

    if (remainingTime <= 0) {
        finishWaiting();
        return;
    }

    countdownInterval = setInterval(function() {

        remainingTime--;

        updateCountdown();

        if (remainingTime <= 0) {

            clearInterval(countdownInterval);

            finishWaiting();

        }

    }, 1000);

}


// Finish waiting

function finishWaiting() {

    clearInterval(countdownInterval);

    triviaActive = false;

    sessionStorage.setItem("triviaScore", triviaScore);

    const triviaArea = document.getElementById("trivia-area");
    const startButton = document.getElementById("start-trivia");
    const message = document.getElementById("timer-message");
    const readyArea = document.getElementById("ready-area");

    if (triviaArea) {
        triviaArea.innerHTML = "<p>Trivia time is over!</p>";
    }

    if (startButton) {
        startButton.disabled = true;
        startButton.textContent = "Trivia Finished";
    }

    if (message) {
        message.textContent = "Your order is ready!";
    }

    if (readyArea) {
        readyArea.innerHTML = `
            <h2>✦ Your order is ready! ✦</h2>
            <p>Thank you for waiting at Cafestage.</p>
            <button onclick="goToKeepsake()">
                View Your Keepsake
            </button>
        `;
    }

}


// Start trivia

function startTrivia() {

    if (remainingTime <= 0 || triviaActive) {
        return;
    }

    triviaActive = true;
    triviaScore = 0;
    currentQuestion = 0;

    questionList = [...triviaQuestions]
        .sort(() => Math.random() - 0.5);

    document.getElementById("start-trivia").disabled = true;

    showQuestion();

}


// Display a question

function showQuestion() {

    if (!triviaActive || remainingTime <= 0) {
        return;
    }

    const area = document.getElementById("trivia-area");

    if (currentQuestion >= questionList.length) {

        area.innerHTML = `
            <h3>You've completed the trivia!</h3>
            <p>Your score: ${triviaScore}</p>
        `;

        triviaActive = false;
        sessionStorage.setItem("triviaScore", triviaScore);

        return;

    }

    const item = questionList[currentQuestion];

    let optionsHTML = "";

    item.options.forEach(option => {

        optionsHTML += `
            <button
                class="trivia-option"
                onclick="checkAnswer('${option.replace(/'/g, "\\'")}')"
            >
                ${option}
            </button>
        `;

    });

    area.innerHTML = `
        <h3>Question ${currentQuestion + 1}</h3>
        <p>${item.question}</p>
        ${optionsHTML}
        <p id="answer-feedback"></p>
    `;

}


// Check answer

function checkAnswer(selectedAnswer) {

    if (!triviaActive || remainingTime <= 0) {
        return;
    }

    const item = questionList[currentQuestion];

    const buttons = document.querySelectorAll(".trivia-option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    const feedback = document.getElementById("answer-feedback");

    if (selectedAnswer === item.answer) {

        triviaScore++;

        feedback.textContent = "Correct! Well done!";

    } else {

        feedback.textContent = "Not quite! The answer is " + item.answer + ".";

    }

    document.getElementById("score").textContent =
        "Score: " + triviaScore;

    sessionStorage.setItem("triviaScore", triviaScore);

    currentQuestion++;

    setTimeout(function() {

        if (triviaActive && remainingTime > 0) {
            showQuestion();
        }

    }, 1000);

}


// Go to keepsake page

function goToKeepsake() {

    window.location.href = "keepsake.html";

}


// Start countdown when waiting page opens

if (document.getElementById("countdown")) {

    startCountdown();

}


/* =========================
   KEEPSAKE PAGE SYSTEM
========================= */

// Load the customer's receipt

function loadReceipt() {

    const receiptItems = document.getElementById("receipt-items");

    if (!receiptItems) return;

    const order = JSON.parse(
        sessionStorage.getItem("orderDetails") || "[]"
    );

    const total = sessionStorage.getItem("orderTotal") || "0.00";

    const prepTime = sessionStorage.getItem("prepTime") || "0";

    const table = sessionStorage.getItem("selectedTable") || "Not selected";

    const name = sessionStorage.getItem("visitorName") || "Guest";

    const visit = sessionStorage.getItem("visitType") || "Walk-in";

    const date = sessionStorage.getItem("orderDate") || "-";

    const score = sessionStorage.getItem("triviaScore") || "0";


    // Display customer information

    document.getElementById("receipt-name").textContent = name;

    document.getElementById("receipt-visit").textContent = visit;

    document.getElementById("receipt-table").textContent = table;

    document.getElementById("receipt-date").textContent = date;

    document.getElementById("receipt-time").textContent = prepTime;

    document.getElementById("receipt-total").textContent = Number(total).toFixed(2);

    document.getElementById("receipt-score").textContent = score;


    // Display ordered products

    receiptItems.innerHTML = "";

    if (order.length === 0) {

        receiptItems.innerHTML = "<p>No order information found.</p>";

    }

    order.forEach(item => {

        const itemTotal = item.price * item.quantity;

        receiptItems.innerHTML += `
            <div class="receipt-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
            </div>
        `;

    });

}


// Open or close the letter

function openLetter() {

    const letter = document.getElementById("letter-content");

    letter.classList.toggle("open");

}


// Return to homepage

function goHome() {

    window.location.href = "index.html";

}


// Load receipt when keepsake page opens

if (document.getElementById("receipt-items")) {

    loadReceipt();

}
