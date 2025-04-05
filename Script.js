//CharSelect Data to game screen
var url = window.location.href;
var urlObject = new URL(url);
var params = new URLSearchParams(urlObject.search);
var charValue = params.get('charselect');
var nameValue = params.get('yourName');
let ChoosenCharacter = charValue;
let Username = nameValue;

const character = document.getElementById("character");
const money = document.getElementById("money");
const food = document.getElementById("food");
const energy = document.getElementById("energy");
const activityButtons = document.getElementById("activity-buttons");
const map = document.getElementById("game-box");

document.querySelector('span#player-name').textContent = `${Username}`;
let x = 0;
let y = 0;
let vyu = 0;
let vyd = 0;
let vxl = 0;
let vxr = 0;
const speed = 3;


// Direction tracking
let currentDirection = 'down';
let lastDirection = 'down';

// Keyboard controls
document.addEventListener("keydown", function(e) {
    if (e.key == "ArrowRight" || e.key == "d") {
        vxr = speed;
        currentDirection = 'right';
    } else if (e.key == "ArrowLeft" || e.key == "a") {
        vxl = -speed;
        currentDirection = 'left';
    } else if (e.key == "ArrowUp" || e.key == "w") {
        vyu = -speed;
        currentDirection = 'up';
    } else if (e.key == "ArrowDown" || e.key == "s") {
        vyd = speed;
        currentDirection = 'down';
    }

    // Sprite Change
    if (currentDirection != lastDirection){
        character.src = `Assets/${ChoosenCharacter}/${currentDirection}.gif`;
        lastDirection = currentDirection;
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key == "ArrowRight" || e.key == "d") vxr = 0;
    else if (e.key == "ArrowLeft" || e.key == "a") vxl = 0;
    else if (e.key == "ArrowUp" || e.key == "w") vyu = 0;
    else if (e.key == "ArrowDown" || e.key == "s") vyd = 0;
});

// Keyboard Controls
function update() {
    x += vxl + vxr;
    y += vyu + vyd;
    
    // Calculate boundaries
    const maxX = map.offsetWidth - character.offsetWidth;
    const maxY = map.offsetHeight - character.offsetHeight;
    

    // Keep character within bounds
    // x = Math.max(0, Math.min(x, maxX));
    // y = Math.max(0, Math.min(y, maxY));
    
    // Apply movement
    character.style.transform = `translate(${x}px, ${y}px)`;
    
    // Check location for activities
    checkLocation(x, y);
    
    requestAnimationFrame(update);
}

// Location checking 
function checkLocation() {
    const charRect = character.getBoundingClientRect();
    const locations = document.getElementsByClassName("location");
    
    for (let loc of locations) {
        const rect = loc.getBoundingClientRect();
        
        if (charRect.left < rect.right && 
            charRect.right > rect.left && 
            charRect.top < rect.bottom && 
            charRect.bottom > rect.top) {
            displayActivities(loc.id);
            break; // Exit after first match
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

function updateGreeting() {
    let options = { timeZone: "Asia/Jakarta", hour12: false, hour: "numeric" };
    let hour = new Intl.DateTimeFormat("en-US", options).format(new Date());

    if (hour >= 5 && hour < 12) document.getElementById("greeting").innerText = "Good Morning";
    else if (hour >= 12 && hour < 18) document.getElementById("greeting").innerText = "Good Afternoon";
    else document.getElementById("greeting").innerText = "Good Evening";
}


window.onload = function() {
    updateGreeting();
    update();
};

window.addEventListener("keydown", function(event) {
    const keysToBlock = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "];
    if (keysToBlock.includes(event.key.toLowerCase())) {
        event.preventDefault();
    }
});