// ===============================
// TaskFlow Todo App
// ===============================


// DOM Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const dueDateInput = document.getElementById("dueDate");

const emptyState = document.getElementById("emptyState");

const themeBtn = document.getElementById("themeBtn");

const sortSelect = document.getElementById("sortSelect");

const clearCompletedBtn =
    document.getElementById("clearCompleted");


// Statistics
const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const progressPercent =
    document.getElementById("progressPercent");

const taskCount =
    document.getElementById("taskCount");


// Edit Modal
const editModal =
    document.getElementById("editModal");

const editInput =
    document.getElementById("editInput");

const closeModal =
    document.getElementById("closeModal");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveEdit =
    document.getElementById("saveEdit");


// ===============================
// Application State
// ===============================

let tasks =
    JSON.parse(localStorage.getItem("taskflow_tasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


// ===============================
// Save Tasks
// ===============================

function saveTasks() {

    localStorage.setItem(
        "taskflow_tasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// Add Task
// ===============================

function addTask() {

    const text = taskInput.value.trim();

    if (!text) {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        priority: priorityInput.value,

        category: categoryInput.value,

        dueDate: dueDateInput.value,

        createdAt: new Date().toISOString()

    };


    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateStats();


    // Reset form
    taskInput.value = "";

    priorityInput.value = "medium";

    categoryInput.value = "General";

    dueDateInput.value = "";

    taskInput.focus();

}


// Button
addBtn.addEventListener("click", addTask);


// Enter key
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ===============================
// Render Tasks
// ===============================

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    // Filter
    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(task => task.completed);

    }


    // Search
    const searchTerm =
        searchInput.value.toLowerCase().trim();


    if (searchTerm) {

        filteredTasks =
            filteredTasks.filter(task =>
                task.text.toLowerCase().includes(searchTerm) ||
                task.category.toLowerCase().includes(searchTerm)
            );

    }


    // Sort
    filteredTasks = sortTasks(filteredTasks);


    // Empty state
    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const li = createTaskElement(task);

        taskList.appendChild(li);

    });


    updateStats();

}


// ===============================
// Create Task Element
// ===============================

function createTaskElement(task) {

    const li = document.createElement("li");

    li.className = "task-item";

    if (task.completed) {

        li.classList.add("completed");

    }


    const priorityClass =
        `priority-${task.priority}`;


    const dueInfo =
        getDueDateInfo(task);


    li.innerHTML = `

        <div class="task-check">

            <button
                class="check-btn"
                data-action="toggle"
                data-id="${task.id}"
                title="Complete task"
            >
                ${task.completed ? "✓" : ""}
            </button>

        </div>


        <div class="task-content">

            <div class="task-title">
                ${escapeHTML(task.text)}
            </div>


            <div class="task-meta">

                <span class="category">
                    ${getCategoryIcon(task.category)}
                    ${escapeHTML(task.category)}
                </span>

                <span class="priority ${priorityClass}">
                    ${getPriorityLabel(task.priority)}
                </span>

                ${
                    task.dueDate
                    ?
                    `<span class="due ${dueInfo.class}">
                        📅 ${dueInfo.text}
                    </span>`
                    :
                    ""
                }

            </div>

        </div>


        <div class="task-actions">

            <button
                class="action-btn edit"
                data-action="edit"
                data-id="${task.id}"
                title="Edit"
            >
                ✏️
            </button>

            <button
                class="action-btn delete"
                data-action="delete"
                data-id="${task.id}"
                title="Delete"
            >
                🗑️
            </button>

        </div>

    `;


    return li;

}


// ===============================
// Task Actions
// ===============================

taskList.addEventListener("click", function (event) {

    const button =
        event.target.closest("button");

    if (!button) return;


    const action =
        button.dataset.action;

    const id =
        Number(button.dataset.id);


    if (action === "toggle") {

        toggleTask(id);

    }


    if (action === "delete") {

        deleteTask(id);

    }


    if (action === "edit") {

        openEditModal(id);

    }

});


// ===============================
// Toggle Task
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ===============================
// Delete Task
// ===============================

function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    renderTasks();

}


// ===============================
// Edit Task
// ===============================

function openEditModal(id) {

    const task =
        tasks.find(task => task.id === id);

    if (!task) return;


    editingTaskId = id;

    editInput.value = task.text;

    editModal.classList.add("show");

    editInput.focus();

}


function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


saveEdit.addEventListener("click", function () {

    const newText =
        editInput.value.trim();


    if (!newText) {

        alert("Task cannot be empty.");

        return;

    }


    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {
                ...task,
                text: newText
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    closeEditModal();

});


// Enter key inside edit
editInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        saveEdit.click();

    }

});


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ===============================
// Filters
// ===============================

document.querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener("click", function () {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            this.classList.add("active");


            currentFilter =
                this.dataset.filter;


            renderTasks();

        });

    });


// ===============================
// Sorting
// ===============================

sortSelect.addEventListener(
    "change",
    renderTasks
);


function sortTasks(list) {

    const sortType =
        sortSelect.value;


    if (sortType === "created") {

        return list.sort(
            (a, b) => b.id - a.id
        );

    }


    if (sortType === "alphabetical") {

        return list.sort(
            (a, b) =>
                a.text.localeCompare(b.text)
        );

    }


    if (sortType === "priority") {

        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        return list.sort(
            (a, b) =>
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
        );

    }


    if (sortType === "date") {

        return list.sort((a, b) => {

            if (!a.dueDate) return 1;

            if (!b.dueDate) return -1;

            return a.dueDate.localeCompare(
                b.dueDate
            );

        });

    }


    return list;

}


// ===============================
// Statistics
// ===============================

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;

    progressPercent.textContent =
        `${progress}%`;

    taskCount.textContent = active;

}


// ===============================
// Clear Completed
// ===============================

clearCompletedBtn.addEventListener(
    "click",
    function () {

        const completed =
            tasks.filter(task => task.completed);


        if (completed.length === 0) {

            alert("There are no completed tasks.");

            return;

        }


        const confirmDelete =
            confirm(
                `Delete ${completed.length} completed task(s)?`
            );


        if (!confirmDelete) return;


        tasks =
            tasks.filter(task => !task.completed);


        saveTasks();

        renderTasks();

    }
);


// ===============================
// Dark Mode
// ===============================

themeBtn.addEventListener(
    "click",
    toggleTheme
);


function toggleTheme() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    themeBtn.textContent =
        isDark ? "☀️" : "🌙";


    localStorage.setItem(
        "taskflow_theme",
        isDark ? "dark" : "light"
    );

}


// Load saved theme
const savedTheme =
    localStorage.getItem("taskflow_theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


// ===============================
// Due Date
// ===============================

function getDueDateInfo(task) {

    if (!task.dueDate) {

        return {
            text: "",
            class: ""
        };

    }


    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const due =
        new Date(task.dueDate);

    due.setHours(0, 0, 0, 0);


    const difference =
        Math.ceil(
            (due - today) /
            (1000 * 60 * 60 * 24)
        );


    if (task.completed) {

        return {
            text: formatDate(task.dueDate),
            class: "normal"
        };

    }


    if (difference < 0) {

        return {
            text: "Overdue",
            class: "overdue"
        };

    }


    if (difference === 0) {

        return {
            text: "Today",
            class: "today"
        };

    }


    if (difference === 1) {

        return {
            text: "Tomorrow",
            class: "tomorrow"
        };

    }


    return {
        text: formatDate(task.dueDate),
        class: "normal"
    };

}


function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// ===============================
// Helpers
// ===============================

function getPriorityLabel(priority) {

    const labels = {

        low: "Low",

        medium: "Medium",

        high: "High"

    };


    return labels[priority];

}


function getCategoryIcon(category) {

    const icons = {

        General: "📌",

        Work: "💼",

        Study: "📚",

        Personal: "👤",

        Shopping: "🛒"

    };


    return icons[category] || "📌";

}


// Prevent HTML injection
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ===============================
// Initial Render
// ===============================

renderTasks();
updateStats();