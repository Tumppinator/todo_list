// DOM Elements
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const showAllButton = document.getElementById("show-all");
const showActiveButton = document.getElementById("show-active");
const showCompletedButton = document.getElementById("show-completed");
const clearCompletedButton = document.getElementById("clear-completed");

// Current filter state
let currentFilter = "all";

// Event listener for adding a new task using the "Enter" key
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});



// Save tasks to localStorage.
function saveTasks() {
  const tasks = Array.from(taskList.children).map((li) => ({
    text: li.querySelector("span").textContent,
    completed: li.querySelector('input[type="checkbox"]').checked,
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage and display them.
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    tasks.forEach((task) => addTask(task.text, task.completed));
  }
}

/**
 * Add a task to the task list.
 *
 * @param {string} taskText - Task description.
 * @param {boolean} [completed=false] - Task completion status.
 */
function addTask(taskText, completed = false) {
  if (taskText.trim() !== "") {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => {
      task.classList.toggle("completed");
      saveTasks();
      filterTasks(currentFilter);
    });

    const task = document.createElement("span");
    task.textContent = taskText;

    task.addEventListener("dblclick", () => {
      editTask(task);
    });

    li.appendChild(checkbox);
    li.appendChild(task);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);

    if (completed) {
      li.classList.add("completed");
    }
  }
}

/**
 * Edit an existing task by converting it into an input element.
 *
 * @param {HTMLElement} task - The task element to edit.
 */
function editTask(task) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.textContent;
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      task.textContent = input.value;
      task.parentElement.replaceChild(task, input);
      saveTasks();
    }
  });

  task.parentElement.replaceChild(input, task);
  input.focus();
}

/**
 * Apply the specified filter to the tasks.
 *
 * @param {string} filter - The filter to apply ("all", "active", or "completed").
 */
function filterTasks(filter) {
  currentFilter = filter;
  Array.from(taskList.children).forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    switch (filter) {
      case "active":
        li.style.display = checkbox.checked ? "none" : "flex";
        break;
      case "completed":
        li.style.display = checkbox.checked ? "flex" : "none";
        break;
      default:
        li.style.display = "flex";
    }
  });
}

/** 

    Remove all completed tasks from the task list.
  */
function clearCompletedTasks() {
  Array.from(taskList.children).forEach((li) => {
    if (li.querySelector('input[type="checkbox"]').checked) {
      li.remove();
    }
  });
  saveTasks();
}

/**

    Set the specified tab as active, and remove the active state from the others.
    @param {HTMLElement} tab - The tab element to set as active.
  */
function setActiveTab(tab) {
  showAllButton.classList.remove("active-tab");
  showActiveButton.classList.remove("active-tab");
  showCompletedButton.classList.remove("active-tab");
  tab.classList.add("active-tab");
}

// Event listeners for filter buttons
showAllButton.addEventListener("click", () => {
  filterTasks("all");
  setActiveTab(showAllButton);
});
showActiveButton.addEventListener("click", () => {
  filterTasks("active");
  setActiveTab(showActiveButton);
});
showCompletedButton.addEventListener("click", () => {
  filterTasks("completed");
  setActiveTab(showCompletedButton);
});
clearCompletedButton.addEventListener("click", clearCompletedTasks);

// Load tasks and set the initial active tab
loadTasks();
setActiveTab(showAllButton);
