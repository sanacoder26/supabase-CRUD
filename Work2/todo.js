
import { supabase } from "./config.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const counter = document.getElementById("counter");

let currentEdit = null;

// ------------------- Progress Update 
function updateProgress() {
  const tasks = taskList.querySelectorAll("li");
  const completed = taskList.querySelectorAll("li.completed");
  const total = tasks.length;
  const done = completed.length;

  counter.textContent = `${done}/${total}`;
  progress.style.width = total === 0 ? "0%" : `${(done / total) * 100}%`;
}

// ------------------- Add Task
window.addTask = function () {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");
  li.className = "task-item";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateProgress();
  });

  // Task text
  const span = document.createElement("span");
  span.textContent = taskText;
  span.className = "task-text";

  // Actions container
  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => openModal(span));

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    li.style.opacity = "0";
    li.style.transform = "translateX(50px)";
    setTimeout(() => {
      li.remove();
      updateProgress();
    }, 300);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);

  taskList.appendChild(li);

  taskInput.value = "";
  updateProgress();
};

// ------------------- Modal Functions 
function openModal(span) {
  currentEdit = span;
  document.getElementById("editInput").value = span.textContent;
  document.getElementById("editModal").classList.add("active");
}

window.closeModal = function () {
  document.getElementById("editModal").classList.remove("active");
  currentEdit = null;
};

window.saveEdit = function () {
  const newValue = document.getElementById("editInput").value.trim();
  if (newValue && currentEdit) {
    currentEdit.textContent = newValue;
  }
  closeModal();
};

// ------------------- Logout 
window.logout = async function () {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    await Swal.fire({
      icon: "info",
      title: "Logged out",
      text: "You have been logged out",
      showConfirmButton: false,
      timer: 1000,
    });

    window.location.href = "index.html";
  } catch (err) {
    Swal.fire("Error", "Something went wrong during logout", "error");
    console.error(err);
  }
};

