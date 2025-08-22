const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load tasks from localStorage on page load
window.onload = loadTasks;

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Clear All Button
clearAllBtn.addEventListener("click", clearAllTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  saveTaskToStorage(task);
  renderTask(task);

  taskInput.value = "";
  toggleClearAllBtn();
}

// Render single task
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";

  const span = document.createElement("span");
  span.textContent = task.text;
  span.style.cursor = "pointer";

  if (task.completed) {
    li.classList.add("completed");
  }

  // Toggle completed
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskStatus(task.text, li.classList.contains("completed"));
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.className = "btn btn-sm btn-danger ms-2";
  delBtn.textContent = "Delete";
  delBtn.onclick = () => {
    li.remove();
    deleteTaskFromStorage(task.text);
    toggleClearAllBtn();
  };

  li.appendChild(span);
  li.appendChild(delBtn);

  taskList.appendChild(li);
}

// Save task to localStorage
function saveTaskToStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
  toggleClearAllBtn();
}

// Update task status (completed/incomplete)
function updateTaskStatus(taskText, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(t => {
    if (t.text === taskText) {
      t.completed = completed;
    }
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task from localStorage
function deleteTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear All Tasks
function clearAllTasks() {
  taskList.innerHTML = ""; // remove all from UI
  localStorage.removeItem("tasks"); // clear storage
  toggleClearAllBtn();
}

// Enable/Disable Clear All button
function toggleClearAllBtn() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  clearAllBtn.disabled = tasks.length === 0;
}
s