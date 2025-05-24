document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts();
    updateDayOfExercise();
});

const workoutData = {
    "Sunday": {
        "dayName": "Rest Day",
        "warmup": "Fully rest and recover. Stretch lightly or do gentle mobility work if desired. Good sleep and nutrition help retain strength and support fat loss.",
        "exercises": []
    },
    "Saturday": {
        "dayName": "Chest & Back",
        "warmup": `
            <p>Jumping jacks or light jump rope – raise heart rate.</p>
            <p>Arm circles and band pull-aparts – mobilize shoulders and scapula.</p>
            <p>Push-ups (bodyweight, easy pace) – activate chest and triceps.</p>
            <p>Cat–cow or thoracic rotations – loosen spine.</p>
        `,
        "exercises": [
            { name: "Barbell Bench Press", type: "Strength", setsReps: "4×5 (heavy)", notes: "Heavy compound (start fresh); full range.", imageUrl: "" },
            { name: "Bent‑Over Barbell Row", type: "Normal Set", setsReps: "4×6–8 (heavy)", notes: "Heavy back movement, alternate with bench.", imageUrl: "" },
            { name: "Incline Dumbbell Press", type: "Superset", setsReps: "3×8–10", notes: "Superset with Seated Cable Row (below).", imageUrl: "" },
            { name: "Seated Cable Row", type: "Superset", setsReps: "3×8–10", notes: "Superset with Incline Press (above).", imageUrl: "" },
            { name: "Cable Fly (or Pec Deck)", type: "Superset", setsReps: "3×12", notes: "Superset with Lat Pulldown (below).", imageUrl: "" },
            { name: "Lat Pulldown (wide grip)", type: "Superset", setsReps: "3×10", notes: "Superset with Cable Fly (above).", imageUrl: "" },
            { name: "Jump Rope Intervals", type: "Finisher", setsReps: "5×(1 min on/1 min off)", notes: "High-intensity cardio blasts.", imageUrl: "" }
        ]
    },
    "Monday": {
        "dayName": "Arms (Biceps & Triceps)",
        "warmup": `
            <p>Light band curls and band triceps pushdowns – wake up biceps/triceps.</p>
            <p>Wrist circles and overhead arm swings – mobilize elbows and shoulders.</p>
            <p>Push-ups or dips (bodyweight) – pre-activate triceps.</p>
        `,
        "exercises": [
            { name: "Weighted Dips (parallel bars)", type: "Strength", setsReps: "4×5 (heavy)", notes: "Heavy triceps compound (add weight).", imageUrl: "" },
            { name: "EZ-Bar Biceps Curl", type: "Superset", setsReps: "3×8–10", notes: "Superset with Cable Triceps Pressdown.", imageUrl: "" },
            { name: "Cable Triceps Pressdown", type: "Superset", setsReps: "3×10", notes: "Superset with EZ-Bar Curl.", imageUrl: "" },
            { name: "Dumbbell Hammer Curl", type: "Superset", setsReps: "3×10–12", notes: "Superset with Overhead Triceps Ext.", imageUrl: "" },
            { name: "Overhead Dumbbell Triceps Ext.", type: "Superset", setsReps: "3×10–12", notes: "Superset with Hammer Curl.", imageUrl: "" },
            { name: "Diamond Push-Ups (Bodyweight)", type: "Finisher", setsReps: "2×AMRAP", notes: "To failure: high-rep tri/biceps burn.", imageUrl: "" }
        ]
    },
    "Tuesday": {
        "dayName": "Shoulders (Delts & Traps)",
        "warmup": `
            <p>Scapular band pull-aparts and YTWLs – warm up shoulder blade musculature.</p>
            <p>Arm swings and shoulder dislocations with band – increase shoulder mobility.</p>
            <p>Light dumbbell shoulder press (very light) – prime delts.</p>
        `,
        "exercises": [
            { name: "Barbell Overhead Press", type: "Strength", setsReps: "4×6 (heavy)", notes: "Heavy shoulder press (no Arnold).", imageUrl: "" },
            { name: "Dumbbell Lateral Raise", type: "Superset", setsReps: "3×12", notes: "Superset with Face Pull.", imageUrl: "" },
            { name: "Face Pull (cable or band)", type: "Superset", setsReps: "3×12", notes: "Superset with Lateral Raise.", imageUrl: "" },
            { name: "Dumbbell Front Raise", type: "Superset", setsReps: "3×12", notes: "Superset with Reverse Fly.", imageUrl: "" },
            { name: "Reverse Delt Fly (cable or DB)", type: "Superset", setsReps: "3×12", notes: "Superset with Front Raise.", imageUrl: "" },
            { name: "Battle Rope Waves", type: "Finisher", setsReps: "5×(30s on/30s off)", notes: "Max-intensity shoulder/core drill.", imageUrl: "" }
        ]
    },
    "Wednesday": {
        "dayName": "Core & HIIT",
        "warmup": `
            <p>Light jog or jumping rope – elevate HR.</p>
            <p>Cat–Cow and torso rotations – mobilize spine.</p>
            <p>Hip flexor lunges – prepare core and hips.</p>
        `,
        "exercises": [
            { name: "Plank (forearms)", type: "Normal Set", setsReps: "3×30 sec holds", notes: "Keep tight core and glutes.", imageUrl: "" },
            { name: "Hanging Leg Raises", type: "Normal Set", setsReps: "3×10–12", notes: "Full hip flexion; control motion.", imageUrl: "" },
            { name: "Russian Twists (wgt)", type: "Normal Set", setsReps: "3×20 (10 each side)", notes: "Torso rotation for obliques.", imageUrl: "" },
            { name: "Back Extension", type: "Normal Set", setsReps: "3×12–15", notes: "(Swiss ball or bench) for low back.", imageUrl: "" },
            { name: "Bicycle Crunch", type: "Normal Set", setsReps: "3×20 (10 each side)", notes: "Controlled, continuous motion.", imageUrl: "" },
            { name: "HIIT Sprints (treadmill or bike)", type: "HIIT/Cardio", setsReps: "5×(30s sprint/90s rest)", notes: "“All-out” effort intervals.", imageUrl: "" }
        ]
    },
    "Thursday": {
        "dayName": "Long Cardio Session",
        "warmup": "Easy jogging or fast walking, plus leg swings and lunges.",
        "exercises": [
            { name: "Light Jog (warm-up)", type: "Warm-Up", setsReps: "10 min", notes: "Easy pace to elevate heart rate.", imageUrl: "" },
            { name: "Steady-State Run", type: "LISS Cardio", setsReps: "2:00–2:30 hrs", notes: "Moderate intensity (Zone 2) for fat burn. Maintain conversational pace to maximize duration.", imageUrl: "" }
        ]
    },
    "Friday": {
        "dayName": "Legs (Quads, Hamstrings, Glutes)",
        "warmup": `
            <p>Bodyweight squats and lunges – prime hips/legs.</p>
            <p>Leg swings (front-to-back, side-to-side) – mobilize hips.</p>
            <p>Hip circles and glute bridges – awaken glutes and core.</p>
        `,
        "exercises": [
            { name: "Back Squat", type: "Strength", setsReps: "4×5 (heavy)", notes: "Heavy compound (use safety bars/spots).", imageUrl: "" },
            { name: "Romanian Deadlift", type: "Normal Set", setsReps: "3×8 (moderate)", notes: "Emphasize hamstrings/glutes, slight knee bend.", imageUrl: "" },
            { name: "Leg Press (feet mid)", type: "Superset", setsReps: "3×12", notes: "Superset with Seated Leg Curl.", imageUrl: "" },
            { name: "Seated Leg Curl", type: "Superset", setsReps: "3×12", notes: "Superset with Leg Press.", imageUrl: "" },
            { name: "Bulgarian Split Squat", type: "Normal Set", setsReps: "3×10 each leg", notes: "Free-weight single-leg, full depth.", imageUrl: "" },
            { name: "Jump Rope", type: "Finisher", setsReps: "5×(1 min on/1 min off)", notes: "Max effort for fat burn (alternatively burpees 3×10).", imageUrl: "" }
        ]
    }
};

let currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
let completedExercises = JSON.parse(localStorage.getItem('completedExercises')) || {};

function updateDayOfExercise() {
    const currentWorkoutDayElement = document.getElementById('current-workout-day');
    const todayWorkout = workoutData[currentDay];
    if (todayWorkout) {
        currentWorkoutDayElement.textContent = `${todayWorkout.dayName}`;
    } else {
        currentWorkoutDayElement.textContent = `Today: Rest Day`;
    }
}

function getCssClassFromType(type) {
    if (!type) return '';
    return type.toLowerCase().replace(/\s+/g, '-'); // Converts "Normal Set" → "normal-set"
}

function loadWorkouts() {
    const workoutList = document.getElementById('workout-list');
    const completedWorkoutList = document.getElementById('completed-workout-list');
    workoutList.innerHTML = '';
    completedWorkoutList.innerHTML = '';
    document.getElementById('completed-section').classList.add('hidden');
    document.getElementById('completion-message').classList.add('hidden');
    document.getElementById('motivation-text').textContent = '';

    const todayWorkout = workoutData[currentDay];

    if (!todayWorkout || todayWorkout.exercises.length === 0) {
        workoutList.innerHTML = `<div class="exercise-item">
            <div class="exercise-header">
                <div class="exercise-info">
                    <span class="exercise-name">Enjoy your ${currentDay}!</span>
                </div>
            </div>
            <div class="exercise-details show">
                <p class="exercise-notes">${todayWorkout?.warmup || 'No specific workout planned for today. Focus on recovery.'}</p>
            </div>
        </div>`;
        return;
    }

    // Add Warm-up
    workoutList.innerHTML += `
        <div class="card exercise-item warm-up">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="exercise-info">
                        <div class="exercise-name">Warm-up</div>
                        <div class="exercise-type">Pre</div>
                        <div class="exercise-sets-reps"></div>
                    </div>
                    <span class="dropdown-arrow ms-2" onclick="toggleDetails(this)">&#9654;</span>
                </div>
                <div class="exercise-details">
                    <p class="exercise-notes">${todayWorkout.warmup}</p>
                    <img src="" alt="Warm-up illustration" class="exercise-image hidden">
                </div>
            </div>
        </div>
    `;

    todayWorkout.exercises.forEach((exercise, index) => {
        const isCompleted = completedExercises[currentDay] && completedExercises[currentDay][`exercise-${index}`];
        const exerciseHtml = `
            <div class="card exercise-item" id="exercise-${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="exercise-info">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-type ${getCssClassFromType(exercise.type)}">${exercise.type}</div>
                            <div class="exercise-sets-reps">${exercise.setsReps}</div>
                        </div>
                        <div class="checkbox-container ${isCompleted ? 'checked' : ''}" data-exercise-index="exercise-${index}" onclick="toggleExerciseCompletion(this)"></div>
                        <span class="dropdown-arrow ms-2" onclick="toggleDetails(this)">&#9654;</span>
                    </div>
                    <div class="exercise-details">
                        <p class="exercise-notes">${exercise.notes}</p>
                        <img src="${exercise.imageUrl}" alt="${exercise.name} image" class="exercise-image ${exercise.imageUrl ? '' : 'hidden'}">
                    </div>
                </div>
            </div>
        `;


        if (isCompleted) {
            completedWorkoutList.innerHTML += `
                <div class="completed-exercise-item d-flex justify-content-between align-items-center">
                    <span>${exercise.name} (${exercise.type})</span>
                    <button class="btn btn-sm reset-btn" data-exercise-index="exercise-${index}" onclick="uncompleteIndividual(this)">Uncomplete</button>
                </div>`;
        } else {
            workoutList.innerHTML += exerciseHtml;
        }
    });

    if (Object.keys(completedExercises[currentDay] || {}).length > 0) {
        document.getElementById('completed-section').classList.remove('hidden');
    }

    updateMotivationText();
    checkAllWorkoutsCompleted();
}


function toggleDetails(arrowElement) {
    const parent = arrowElement.closest('.exercise-item');
    const details = parent.querySelector('.exercise-details');
    arrowElement.classList.toggle('rotated');
    details.classList.toggle('show');
}

function toggleExerciseCompletion(checkboxContainer) {
    const exerciseItem = checkboxContainer.closest('.exercise-item');
    const exerciseId = checkboxContainer.dataset.exerciseIndex;

    if (!completedExercises[currentDay]) {
        completedExercises[currentDay] = {};
    }

    if (checkboxContainer.classList.contains('checked')) {
        // Unmark as completed from main list
        checkboxContainer.classList.remove('checked');
        delete completedExercises[currentDay][exerciseId];
    } else {
        // Mark as completed
        checkboxContainer.classList.add('checked');
        completedExercises[currentDay][exerciseId] = true;
    }

    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
    loadWorkouts(); // Reload to move completed exercises to the bottom section
    updateMotivationText();
    checkAllWorkoutsCompleted();
}

function uncompleteIndividual(buttonElement) {
    const exerciseId = buttonElement.dataset.exerciseIndex;
    if (completedExercises[currentDay] && completedExercises[currentDay][exerciseId]) {
        delete completedExercises[currentDay][exerciseId];
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
        loadWorkouts(); // Reload to move it back
    }
}


function updateMotivationText() {
    const motivationTextElement = document.getElementById('motivation-text');
    const totalExercises = (workoutData[currentDay]?.exercises?.length || 0) + (workoutData[currentDay]?.warmup ? 1 : 0);
    const completedCount = Object.keys(completedExercises[currentDay] || {}).length;

    if (totalExercises === 0) {
        motivationTextElement.textContent = "It's a rest day! Enjoy your recovery.";
        return;
    }

    if (completedCount === 0) {
        motivationTextElement.textContent = "Start your workout strong!";
    } else if (completedCount > 0 && completedCount < totalExercises) {
        motivationTextElement.textContent = `You're doing great! Keep pushing – ${totalExercises - completedCount} more to go!`;
    } else if (completedCount === totalExercises) {
        motivationTextElement.textContent = "Awesome work! You crushed it!";
    }
}

function checkAllWorkoutsCompleted() {
    const totalExercises = (workoutData[currentDay]?.exercises?.length || 0) + (workoutData[currentDay]?.warmup ? 1 : 0);
    const completedCount = Object.keys(completedExercises[currentDay] || {}).length;
    const completionMessage = document.getElementById('completion-message');

    if (totalExercises > 0 && completedCount === totalExercises) {
        completionMessage.classList.remove('hidden');
        setTimeout(() => {
            completionMessage.classList.add('hidden');
        }, 3000); // Hide after 3 seconds
    } else {
        completionMessage.classList.add('hidden');
    }
}

function resetCompletedIndividual() {
    if (confirm("Are you sure you want to reset all completed exercises for today?")) {
        completedExercises[currentDay] = {};
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
        loadWorkouts();
    }
}

// Function to show the custom confirmation modal
function showRefreshConfirmModal() {
    document.getElementById('refreshConfirmModal').classList.remove('hidden');
}

// Function to hide the custom confirmation modal
function hideRefreshConfirmModal() {
    document.getElementById('refreshConfirmModal').classList.add('hidden');
}

// Original refreshWorkouts function, now simplified to trigger the modal
function refreshWorkouts() {
    showRefreshConfirmModal();
}

// Add event listeners for the Yes and No buttons in the modal
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...

    document.getElementById('confirmRefreshYes').addEventListener('click', () => {
        completedExercises = {}; // Clear ALL completed exercises
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
        loadWorkouts();
        hideRefreshConfirmModal(); // Hide the modal after confirmation
    });

    document.getElementById('confirmRefreshNo').addEventListener('click', () => {
        hideRefreshConfirmModal(); // Just hide the modal if 'No' is clicked
    });
});

function showHomePage() {
    // In this static app, showHomePage just reloads the current day's workouts
    loadWorkouts();
}