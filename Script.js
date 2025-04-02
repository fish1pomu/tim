let character = document.getElementById("character");
let money = document.getElementById("money");
let food = document.getElementById("food");
let energy = document.getElementById("energy");
let activityButtons = document.getElementById("activity-buttons");
let movementInterval;

function moveCharacter(x, y) {
    let newX = character.offsetLeft + x;
    let newY = character.offsetTop + y;
    character.style.left = newX + "px";
    character.style.top = newY + "px";
    checkLocation(newX, newY);
}

function startMoving(x, y) {
    if (movementInterval) return;
    movementInterval = setInterval(() => moveCharacter(x, y), 100);
}

function stopMoving() {
    clearInterval(movementInterval);
    movementInterval = null;
}

function checkLocation(x, y) {
    let locations = document.getElementsByClassName("location");
    for (let loc of locations) {
        let rect = loc.getBoundingClientRect();
        let charRect = character.getBoundingClientRect();
        if (charRect.left < rect.right && charRect.right > rect.left && charRect.top < rect.bottom && charRect.bottom > rect.top) {
            displayActivities(loc.id);
        }
    }
}

function displayActivities(location) {
    let activities = {
        home: [
            { name: "Eat", effect: () => food.innerText = parseInt(food.innerText) + 10 },
            { name: "Sleep", effect: () => energy.innerText = parseInt(energy.innerText) + 20 },
            { name: "Do Chores", effect: () => money.innerText = parseInt(money.innerText) + 500 }
        ],
        beach: [
            { name: "Relax", effect: () => energy.innerText = parseInt(energy.innerText) + 20 }
        ],
        lake: [
            { name: "Fish", effect: () => food.innerText = parseInt(food.innerText) + 15 }
        ],
        temple: [
            { name: "Meditate", effect: () => energy.innerText = parseInt(energy.innerText) + 5 }
        ],
        mountain: [
            { name: "Hike", effect: () => energy.innerText = parseInt(energy.innerText) - 10 }
        ]
    };
    
    activityButtons.innerHTML = "";
    if (activities[location]) {
        activities[location].forEach(activity => {
            let button = document.createElement("button");
            button.classList.add("btn", "btn-primary", "w-100", "mb-2");
            button.innerText = activity.name;
            button.onclick = activity.effect;
            activityButtons.appendChild(button);
        });
    }
}

function getJakartaTime() {
    let options = { timeZone: "Asia/Jakarta", hour12: false, hour: "numeric" };
    let hour = new Intl.DateTimeFormat("en-US", options).format(new Date());

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    return "Good Evening";
}

function updateGreeting() {
    document.getElementById("greeting").innerText = getJakartaTime();
}

window.onload = updateGreeting;

let keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function gameLoop() {
    let dx = 0, dy = 0;
    
    if (keys["ArrowUp"] || keys["w"]) dy -= 20;
    if (keys["ArrowDown"] || keys["s"]) dy += 20;
    if (keys["ArrowLeft"] || keys["a"]) dx -= 20;
    if (keys["ArrowRight"] || keys["d"]) dx += 20;
    
    if (dx !== 0 || dy !== 0) moveCharacter(dx, dy);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keyup", stopMoving);

document.addEventListener("DOMContentLoaded", function () {
    let storedName = localStorage.getItem("playerName");
    if (storedName) {
        document.getElementById("player-name").innerText = storedName;
    }
});
