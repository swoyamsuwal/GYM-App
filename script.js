document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts();
    updateDayOfExercise();
    // Add event listeners for the Yes and No buttons in the refresh modal
    document.getElementById('confirmRefreshYes').addEventListener('click', () => {
        completedExercises = {}; // Clear ALL completed exercises
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
        // Reset currentDay to ensure it's fresh if it was changed by other logic (if any)
        currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
        updateDayOfExercise(); // Update the displayed day name
        loadWorkouts();
        hideRefreshConfirmModal(); // Hide the modal after confirmation
    });

    document.getElementById('confirmRefreshNo').addEventListener('click', () => {
        hideRefreshConfirmModal(); // Just hide the modal if 'No' is clicked
    });

    // Slider event listener
    const completeSlider = document.getElementById('completeSlider');
    completeSlider.addEventListener('input', function () { // Use 'input' for smoother UI update if needed, 'change' for final value
      // Visual feedback while sliding can be added here if desired
    });

    completeSlider.addEventListener('change', function () {
        if (this.value >= 100 && sliderExerciseId) { // sliderExerciseId is the displayId
            if (!completedExercises[currentDay]) {
                completedExercises[currentDay] = {};
            }

            sliderActualExerciseIds.forEach(id => {
                completedExercises[currentDay][id] = true;
            });

            localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
            loadWorkouts();
            updateMotivationText();
            checkAllWorkoutsCompleted();
            document.getElementById('sliderPopup').classList.add('hidden');
            
            // Reset slider state variables
            sliderExerciseId = null;
            sliderIsSuperset = false;
            sliderActualExerciseIds = [];
            this.value = 0; // Reset slider position
        } else if (this.value < 100) {
            // Snap back if not dragged to 100%
            this.value = 0;
        }
    });
});

const workoutData = {
    "Saturday": {
        "dayName": "Rest Day",
        "warmup": "Fully rest and recover. Stretch lightly or do gentle mobility work if desired. Good sleep and nutrition help retain strength and support fat loss.",
        "exercises": []
    },
    "Sunday": {
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

// Variables for slider state
let sliderExerciseId = null; // ID of the DOM element being interacted with (e.g., 'superset-display-0' or 'exercise-2')
let sliderIsSuperset = false;
let sliderActualExerciseIds = []; // Actual IDs for marking completion (e.g., ['exercise-0', 'exercise-1'] or ['exercise-2'])


function updateDayOfExercise() {
    const currentWorkoutDayElement = document.getElementById('current-workout-day');
    const todayWorkout = workoutData[currentDay];
    if (todayWorkout) {
        currentWorkoutDayElement.textContent = `${todayWorkout.dayName}`;
    } else {
        // Fallback if currentDay isn't in workoutData (should not happen with Date())
        currentWorkoutDayElement.textContent = `Today: Rest Day`;
    }
}

function getCssClassFromType(type) {
    if (!type) return '';
    return type.toLowerCase().replace(/\s+/g, '-');
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
                <div class="exercise-notes">${todayWorkout?.warmup || 'No specific workout planned for today. Focus on recovery.'}</div>
            </div>
        </div>`;
        updateMotivationText(); // Update motivation even for rest/no workout days
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
                    <div class="exercise-notes">${todayWorkout.warmup}</div>
                    <img src="" alt="Warm-up illustration" class="exercise-image hidden">
                </div>
            </div>
        </div>
    `;

    let exerciseHtmlList = [];
    let completedExerciseHtmlList = [];
    let i = 0;
    while (i < todayWorkout.exercises.length) {
        const exercise1 = todayWorkout.exercises[i];

        if (exercise1.type === "Superset" && i + 1 < todayWorkout.exercises.length && todayWorkout.exercises[i+1].type === "Superset") {
            const exercise2 = todayWorkout.exercises[i+1];
            const supersetDisplayId = `superset-display-${i}`; // Unique ID for the superset card in the DOM
            const exerciseId1 = `exercise-${i}`; // Actual ID for exercise 1 for completion tracking
            const exerciseId2 = `exercise-${i+1}`; // Actual ID for exercise 2 for completion tracking

            const isCompleted1 = completedExercises[currentDay] && completedExercises[currentDay][exerciseId1];
            const isCompleted2 = completedExercises[currentDay] && completedExercises[currentDay][exerciseId2];
            const isPairCompleted = isCompleted1 && isCompleted2;

            if (isPairCompleted) {
                completedExerciseHtmlList.push(`
                    <div class="completed-exercise-item d-flex justify-content-between align-items-center">
                        <span>${exercise1.name} & ${exercise2.name} (Superset)</span>
                        <button class="btn btn-sm reset-btn" data-exercise-ids='["${exerciseId1}", "${exerciseId2}"]' onclick="uncompleteSuperset(this)">Uncomplete</button>
                    </div>`);
            } else {
                exerciseHtmlList.push(`
                <div class="card exercise-item" id="${supersetDisplayId}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="exercise-info">
                                <div class="exercise-name">${exercise1.name} & ${exercise2.name}</div>
                                <div class="exercise-type ${getCssClassFromType(exercise1.type)}">Superset</div>
                                <div class="exercise-sets-reps">${exercise1.setsReps} / ${exercise2.setsReps}</div>
                            </div>
                            <button class="start-square-button" onclick="showSliderPopup('${supersetDisplayId}', true, ['${exerciseId1}', '${exerciseId2}'])">Start</button>
                            <span class="dropdown-arrow ms-2" onclick="toggleDetails(this)">&#9654;</span>
                        </div>
                        <div class="exercise-details">
                            <div class="exercise-notes"><strong>${exercise1.name}:</strong> ${exercise1.notes}</div>
                            <img src="${exercise1.imageUrl}" alt="${exercise1.name} image" class="exercise-image ${exercise1.imageUrl ? '' : 'hidden'}">
                            <hr class="my-2" style="border-top: 1px solid #444;">
                            <div class="exercise-notes"><strong>${exercise2.name}:</strong> ${exercise2.notes}</div>
                            <img src="${exercise2.imageUrl}" alt="${exercise2.name} image" class="exercise-image ${exercise2.imageUrl ? '' : 'hidden'}">
                        </div>
                    </div>
                </div>
                `);
            }
            i += 2; // Consumed two exercises
        } else {
            // Handle single exercise
            const exerciseId = `exercise-${i}`; // Actual ID for completion tracking and DOM ID
            const isCompleted = completedExercises[currentDay] && completedExercises[currentDay][exerciseId];

            if (isCompleted) {
                completedExerciseHtmlList.push(`
                    <div class="completed-exercise-item d-flex justify-content-between align-items-center">
                        <span>${exercise1.name} (${exercise1.type})</span>
                        <button class="btn btn-sm reset-btn" data-exercise-index="${exerciseId}" onclick="uncompleteIndividual(this)">Uncomplete</button>
                    </div>`);
            } else {
                exerciseHtmlList.push(`
                <div class="card exercise-item" id="${exerciseId}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="exercise-info">
                                <div class="exercise-name">${exercise1.name}</div>
                                <div class="exercise-type ${getCssClassFromType(exercise1.type)}">${exercise1.type}</div>
                                <div class="exercise-sets-reps">${exercise1.setsReps}</div>
                            </div>
                            <button class="start-square-button" onclick="showSliderPopup('${exerciseId}', false, ['${exerciseId}'])">Start</button>
                            <span class="dropdown-arrow ms-2" onclick="toggleDetails(this)">&#9654;</span>
                        </div>
                        <div class="exercise-details">
                            <div class="exercise-notes">${exercise1.notes}</div>
                            <img src="${exercise1.imageUrl}" alt="${exercise1.name} image" class="exercise-image ${exercise1.imageUrl ? '' : 'hidden'}">
                        </div>
                    </div>
                </div>
                `);
            }
            i += 1; // Consumed one exercise
        }
    }

    workoutList.innerHTML += exerciseHtmlList.join('');
    completedWorkoutList.innerHTML += completedExerciseHtmlList.join('');

    if (completedExerciseHtmlList.length > 0) {
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

function uncompleteIndividual(buttonElement) {
    const exerciseId = buttonElement.dataset.exerciseIndex;
    if (completedExercises[currentDay] && completedExercises[currentDay][exerciseId]) {
        delete completedExercises[currentDay][exerciseId];
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
        loadWorkouts();
    }
}

function uncompleteSuperset(buttonElement) {
    const exerciseIdsStr = buttonElement.dataset.exerciseIds;
    try {
        const exerciseIds = JSON.parse(exerciseIdsStr); // Parses string like '["exercise-0", "exercise-1"]'

        if (completedExercises[currentDay] && Array.isArray(exerciseIds)) {
            exerciseIds.forEach(id => {
                if (completedExercises[currentDay][id]) {
                    delete completedExercises[currentDay][id];
                }
            });
            localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
            loadWorkouts(); 
        }
    } catch (e) {
        console.error("Error parsing exercise IDs for uncompleting superset:", e);
    }
}


function updateMotivationText() {
    const motivationTextElement = document.getElementById('motivation-text');
    const todayWorkout = workoutData[currentDay];

    if (!todayWorkout || todayWorkout.exercises.length === 0) {
        motivationTextElement.textContent = "It's a rest day! Enjoy your recovery.";
        return;
    }
    
    const totalCompletableExercises = todayWorkout.exercises.length;
    const completedCount = Object.keys(completedExercises[currentDay] || {}).length;

    if (totalCompletableExercises === 0) { // Should be covered by the first check, but good as a fallback
        motivationTextElement.textContent = "No exercises planned for today.";
        return;
    }

    if (completedCount === 0) {
        motivationTextElement.textContent = "Start your workout strong!";
    } else if (completedCount > 0 && completedCount < totalCompletableExercises) {
        const remaining = totalCompletableExercises - completedCount;
        motivationTextElement.textContent = `You're doing great! Keep pushing – ${remaining} more exercise${remaining > 1 ? 's' : ''} to go!`;
    } else if (completedCount === totalCompletableExercises) {
        motivationTextElement.textContent = "Awesome work! You crushed it!";
    }
}

function checkAllWorkoutsCompleted() {
    const todayWorkout = workoutData[currentDay];
    if (!todayWorkout || todayWorkout.exercises.length === 0) {
        document.getElementById('completion-message').classList.add('hidden');
        return;
    }

    const totalCompletableExercises = todayWorkout.exercises.length;
    const completedCount = Object.keys(completedExercises[currentDay] || {}).length;
    const completionMessage = document.getElementById('completion-message');

    if (totalCompletableExercises > 0 && completedCount === totalCompletableExercises) {
        completionMessage.classList.remove('hidden');
        setTimeout(() => {
            completionMessage.classList.add('hidden');
        }, 3000);
    } else {
        completionMessage.classList.add('hidden');
    }
}

function resetCompletedIndividual() { // Resets completed for *today*
    if (confirm("Are you sure you want to reset all completed exercises for today?")) {
        if (completedExercises[currentDay]) {
            completedExercises[currentDay] = {};
            localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
            loadWorkouts();
        }
    }
}

function showRefreshConfirmModal() {
    document.getElementById('refreshConfirmModal').classList.remove('hidden');
}

function hideRefreshConfirmModal() {
    document.getElementById('refreshConfirmModal').classList.add('hidden');
}

function refreshWorkouts() { // This button now means reset ALL days
    showRefreshConfirmModal();
}

function showHomePage() {
    currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    updateDayOfExercise();
    loadWorkouts();
}

function showSliderPopup(displayId, isSuperset = false, actualIds = []) {
  sliderExerciseId = displayId; 
  sliderIsSuperset = isSuperset;
  sliderActualExerciseIds = actualIds; 

  const card = document.getElementById(displayId);
  const workoutName = card?.querySelector('.exercise-name')?.textContent || 'Workout';
  document.getElementById('sliderWorkoutName').textContent = workoutName;

  const slider = document.getElementById('completeSlider');
  slider.value = 0; // Reset slider position

  document.getElementById('sliderPopup').classList.remove('hidden');
}

// Note: The slider's event listener is now placed inside DOMContentLoaded for better practice.
// The global variables sliderExerciseId, sliderIsSuperset, sliderActualExerciseIds are defined outside functions.