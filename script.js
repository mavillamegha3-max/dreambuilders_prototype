/* ================= AGROJAL PROTOTYPE ================= */

const loginPage = document.getElementById("loginPage");
const languagePage = document.getElementById("languagePage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const farmerNameInput = document.getElementById("farmerName");
const passwordInput = document.getElementById("password");

const continueButton = document.getElementById("continueButton");
const languageCards = document.querySelectorAll(".language-card");

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");

const pumpButton = document.getElementById("pumpButton");
const controlPumpButton = document.getElementById("controlPumpButton");

const pumpStatus = document.getElementById("pumpStatus");
const controlStatus = document.getElementById("controlStatus");

const flowSlider = document.getElementById("flowSlider");
const controlFlowSlider = document.getElementById("controlFlowSlider");

const flowValue = document.getElementById("flowValue");
const controlFlowValue = document.getElementById("controlFlowValue");

const todayUsage = document.getElementById("todayUsage");
const usageToday = document.getElementById("usageToday");
const usageFlow = document.getElementById("usageFlow");

const activityList = document.getElementById("activityList");

let farmerName = "";
let selectedLanguage = "en";
let pumpIsOn = false;
let flowRate = 5;
let waterUsed = 250;
let chart = null;


/* ================= LANGUAGE TRANSLATIONS ================= */

const translations = {

    en: {
        dashboard: "📊 Dashboard",
        control: "💧 Water Control",
        usage: "📈 Water Usage",
        settings: "⚙️ Settings",
        about: "🌱 About AgroJal",
        help: "❓ Help & Support",
        greeting: "Monitor and manage your water system."
    },

    te: {
        dashboard: "📊 డాష్‌బోర్డ్",
        control: "💧 నీటి నియంత్రణ",
        usage: "📈 నీటి వినియోగం",
        settings: "⚙️ సెట్టింగ్‌లు",
        about: "🌱 అగ్రోజల్ గురించి",
        help: "❓ సహాయం",
        greeting: "మీ నీటి వ్యవస్థను పర్యవేక్షించండి."
    },

    hi: {
        dashboard: "📊 डैशबोर्ड",
        control: "💧 जल नियंत्रण",
        usage: "📈 पानी का उपयोग",
        settings: "⚙️ सेटिंग्स",
        about: "🌱 एग्रोजल के बारे में",
        help: "❓ सहायता",
        greeting: "अपने जल सिस्टम की निगरानी करें।"
    },

    ta: {
        dashboard: "📊 முகப்புப் பலகை",
        control: "💧 நீர் கட்டுப்பாடு",
        usage: "📈 நீர் பயன்பாடு",
        settings: "⚙️ அமைப்புகள்",
        about: "🌱 அக்ரோஜல் பற்றி",
        help: "❓ உதவி",
        greeting: "உங்கள் நீர் அமைப்பைக் கண்காணிக்கவும்."
    }

};


/* ================= LOGIN ================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    farmerName = farmerNameInput.value.trim();

    const password = passwordInput.value;

    if (farmerName.length === 0) {
        alert("Please enter your name.");
        return;
    }

    if (password.length < 4) {
        alert("Password must contain at least 4 characters.");
        return;
    }

    loginPage.classList.add("hidden");
    languagePage.classList.remove("hidden");

});


/* ================= LANGUAGE CARD SELECTION ================= */

languageCards.forEach(function (card) {

    card.addEventListener("click", function () {

        selectedLanguage = card.dataset.language;

        languageCards.forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

    });

});


/* ================= CONTINUE TO DASHBOARD ================= */

continueButton.addEventListener("click", function () {

    loginPage.classList.add("hidden");
    languagePage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");

    welcomeMessage.textContent = "Welcome, " + farmerName;

    applyLanguage();
    updateDate();
    updatePumpDisplay();
    updateFlowDisplay();

    showSection("dashboard");
    createChart();

});


/* ================= APPLY LANGUAGE ================= */

function applyLanguage() {

    const words =
        translations[selectedLanguage] || translations.en;

    document.documentElement.lang = selectedLanguage;

    document.querySelectorAll(".nav-button").forEach(function (button) {

        const sectionName = button.dataset.section;

        button.textContent =
            words[sectionName] || sectionName;

    });

    document.getElementById("dashboardHeading").textContent =
        words.dashboard.replace(/^.{2}\s/, "");

    document.getElementById("dashboardGreeting").textContent =
        words.greeting;

    document.getElementById("settingsLanguage").value =
        selectedLanguage;

}


/* ================= DATE ================= */

function updateDate() {

    const dateElement = document.getElementById("currentDate");

    dateElement.textContent = new Date().toLocaleDateString(
        selectedLanguage,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= NAVIGATION ================= */

document.querySelectorAll(".nav-button").forEach(function (button) {

    button.addEventListener("click", function () {

        showSection(button.dataset.section);

    });

});


/* QUICK ACTION BUTTONS */

document.querySelectorAll(".quick-action").forEach(function (button) {

    button.addEventListener("click", function () {

        showSection(button.dataset.section);

    });

});


function showSection(sectionId) {

    document.querySelectorAll(".content-section").forEach(
        function (section) {

            section.classList.add("hidden");

        }
    );

    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-button").forEach(
        function (button) {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionId
            );

        }
    );

}


/* ================= PUMP CONTROL ================= */

pumpButton.addEventListener("click", togglePump);

controlPumpButton.addEventListener("click", togglePump);


function togglePump() {

    pumpIsOn = !pumpIsOn;

    updatePumpDisplay();

    if (pumpIsOn) {

        addActivity("Demo pump turned ON.");

    } else {

        addActivity("Demo pump turned OFF.");

    }

}


function updatePumpDisplay() {

    if (pumpIsOn) {

        pumpStatus.textContent = "ON";
        pumpStatus.className = "status online";

        pumpButton.textContent = "Turn OFF";
        controlPumpButton.textContent = "Turn OFF";

        controlStatus.textContent = "ON";
        controlStatus.style.color = "#087443";

    } else {

        pumpStatus.textContent = "OFF";
        pumpStatus.className = "status off";

        pumpButton.textContent = "Turn ON";
        controlPumpButton.textContent = "Turn ON";

        controlStatus.textContent = "OFF";
        controlStatus.style.color = "#c0392b";

    }

}


/* ================= FLOW RATE ================= */

flowSlider.addEventListener("input", function () {

    updateFlowRate(Number(flowSlider.value));

});


controlFlowSlider.addEventListener("input", function () {

    updateFlowRate(Number(controlFlowSlider.value));

});


function updateFlowRate(value) {

    flowRate = value;

    updateFlowDisplay();

    addActivity("Displayed flow rate changed to " + value + " L/min.");

}


function updateFlowDisplay() {

    flowSlider.value = flowRate;
    controlFlowSlider.value = flowRate;

    flowValue.textContent = flowRate;
    controlFlowValue.textContent = flowRate;
    usageFlow.textContent = flowRate;

}


/* ================= SIMULATED WATER USAGE ================= */

/*
    The example consumption increases once per minute while
    the simulated pump is ON and the flow rate is above zero.

    This is demonstration data, not a real sensor measurement.
*/

setInterval(function () {

    if (pumpIsOn && flowRate > 0) {

        waterUsed += flowRate;

        todayUsage.textContent = waterUsed;
        usageToday.textContent = waterUsed;

        if (chart) {

            chart.data.datasets[0].data[6] = waterUsed;

            chart.update("none");

        }

    }

}, 60000);


/* ================= ACTIVITY LOG ================= */

function addActivity(message) {

    const item = document.createElement("li");

    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    item.textContent = time + " - " + message;

    activityList.prepend(item);

    while (activityList.children.length > 8) {

        activityList.removeChild(activityList.lastElementChild);

    }

}


/* ================= CHART ================= */

function createChart() {

    const canvas = document.getElementById("usageChart");

    if (typeof Chart === "undefined") {

        canvas.insertAdjacentHTML(
            "afterend",
            "<p>Chart requires an internet connection to load.</p>"
        );

        return;

    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Today"
            ],

            datasets: [{

                label: "Water Usage (Litres)",

                data: [
                    180,
                    220,
                    190,
                    260,
                    230,
                    280,
                    waterUsed
                ],

                backgroundColor: "#42a66c",
                borderRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            scales: {

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Litres"
                    }
                }

            },

            plugins: {

                legend: {
                    display: true
                }

            }

        }

    });

}


/* ================= SETTINGS ================= */

document.getElementById("saveLanguageButton")
    .addEventListener("click", function () {

        selectedLanguage =
            document.getElementById("settingsLanguage").value;

        languageCards.forEach(function (card) {

            card.classList.toggle(
                "selected",
                card.dataset.language === selectedLanguage
            );

        });

        applyLanguage();
        updateDate();

        addActivity("Language preference changed.");

        alert("Language preference updated.");

    });


/* ================= LOGOUT ================= */

logoutButton.addEventListener("click", function () {

    const confirmed = confirm("Do you want to log out?");

    if (!confirmed) {
        return;
    }

    loginForm.reset();

    pumpIsOn = false;
    flowRate = 5;
    waterUsed = 250;

    updatePumpDisplay();
    updateFlowDisplay();

    todayUsage.textContent = waterUsed;
    usageToday.textContent = waterUsed;

    dashboardPage.classList.add("hidden");
    languagePage.classList.add("hidden");

    loginPage.classList.remove("hidden");

});