// Global Variables
let tasks = [];

// Load tasks from local storage
document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateStats();
    }
});

// Save tasks to local storage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add a new task
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text, completed: false });
        taskInput.value = "";
        updateTaskList();
        updateStats();
        saveTasks();
    } else {
        taskInput.style.border = "2px solid red";
        setTimeout(() => (taskInput.style.border = ""), 1500);
    }
};

// Update the task list based on the active filter
const updateTaskList = (filter = "all") => {
    const taskList = document.getElementById("task_list");
    taskList.innerHTML = "";

    tasks
        .filter((task) => {
            if (filter === "all") return true;
            return filter === "completed" ? task.completed : !task.completed;
        })
        .forEach((task, index) => {
            const listItem = createTaskElement(task, index);
            taskList.appendChild(listItem);
        });
};

// Create a task element
const createTaskElement = (task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("taskItem");

    listItem.innerHTML = `
        <div class="task ${task.completed ? "completed" : ""}">
            <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
            <p>${task.text}</p>
        </div>
        <div class="icons">
            <img src="./img/edit.png" onClick="editTask(${index})" alt="Edit Task">
            <img src="./img/bin.png" onClick="deleteTask(${index})" alt="Delete Task">
        </div>
    `;

    // Add event listeners for task actions
    const checkbox = listItem.querySelector(".checkbox");
    checkbox.addEventListener("change", () => toggleTaskComplete(index));

    return listItem;
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList(getActiveFilter());
    updateStats();
    saveTasks();
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList(getActiveFilter());
    updateStats();
    saveTasks();
};

// Edit a task
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTaskList(getActiveFilter());
    updateStats();
    saveTasks();
};

// Update task stats
const updateStats = () => {
    const completeTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progressBar = document.getElementById("progress");
    const progress = totalTasks ? (completeTasks / totalTasks) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    document.getElementById("numbers").innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

// Blast confetti when all tasks are completed
const blastConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};

// Add event listener to the add task button
document.getElementById("newTask").addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

// Handle filter buttons
document.querySelector(".filter-buttons").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const filter = e.target.getAttribute("data-filter");

        // Update active button state
        document.querySelectorAll(".filter-button").forEach((button) =>
            button.classList.remove("active")
        );
        e.target.classList.add("active");

        // Update the task list based on the selected filter
        updateTaskList(filter);
    }
});

// Get the current active filter
const getActiveFilter = () => {
    const activeButton = document.querySelector(".filter-button.active");
    return activeButton.getAttribute("data-filter");
};
