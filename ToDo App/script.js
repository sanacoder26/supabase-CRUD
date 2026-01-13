
// import supabase from "./config.js"

// const title = document.getElementById("title")
// const desc = document.getElementById("des")
// const priority = document.querySelector(".form-select")
// const btn = document.getElementById("btn")
// const main = document.getElementById("main")

// let editId = null

// // Function to fetch and display all tasks
// async function fetchTasks() {
//     try {
//         const { data, error } = await supabase
//             .from('task manager')
//             .select("*")

//         if (error) throw error

//         main.innerHTML = ""  // Clear previous content before adding new

//         data.forEach(task => {
//             main.innerHTML += `
//             <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
//                 <div class="card h-100">
//                     <div class="card-body">
//                         <h5 class="card-title">${task.title}</h5>
//                         <p class="card-text">${task.description}</p>
//                         <div>Status: ${task.status}</div>
//                     </div>
//                     <div>
//                         <button class='btn btn-primary' onclick='edtTodo(${task.id},"${task.title}","${task.description}","${task.status}")'>🖊️ Edit</button>
//                         <button class='btn btn-danger' onclick='deleteTodo(${task.id})'>🗑️ Delete</button>
//                     </div>
//                 </div>
//             </div>`
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// // Add or Update task
// async function add(e) {
//     e.preventDefault()
    
//     // Validation using SweetAlert2
//     if (!title.value || !desc.value || !priority.value) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Oops...',
//             text: 'Please fill all fields!'
//         })
//         return
//     }

//     try {
//         if (editId) {
//             // Update existing task
//             const { error } = await supabase
//                 .from('task manager')
//                 .update({
//                     title: title.value,
//                     description: desc.value,
//                     status: priority.value
//                 })
//                 .eq('id', editId)

//             if (error) throw error

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Updated!',
//                 text: 'Task has been updated.'
//             })

//             editId = null
//             btn.textContent = "Add Task"
//         } else {
//             // Add new task
//             const { error } = await supabase
//                 .from('task manager')
//                 .insert({
//                     title: title.value,
//                     description: desc.value,
//                     status: priority.value
//                 })

//             if (error) throw error

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Added!',
//                 text: 'Task has been added.'
//             })
//         }

//         // Clear input fields
//         title.value = ""
//         desc.value = ""
//         priority.value = ""

//         // Refresh task list
//         fetchTasks()
//     } catch (error) {
//         console.log(error)
//         Swal.fire('Error!', 'Something went wrong', 'error')
//     }
// }

// // Edit function
// window.edtTodo = (id, taskTitle, taskDesc, taskStatus) => {
//     editId = id
//     title.value = taskTitle
//     desc.value = taskDesc
//     priority.value = taskStatus
//     btn.textContent = "Update Task"
// }

// // Delete function with SweetAlert2
// window.deleteTodo = async (id) => {
//     const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//     })

//     if (result.isConfirmed) {
//         try {
//             const { error } = await supabase
//                 .from('task manager')
//                 .delete()
//                 .eq('id', id)
//             if (error) throw error

//             Swal.fire(
//                 'Deleted!',
//                 'Your task has been deleted.',
//                 'success'
//             )

//             fetchTasks()
//         } catch (error) {
//             console.log(error)
//             Swal.fire('Error!', 'Something went wrong', 'error')
//         }
//     }
// }

// // Initial fetch
// fetchTasks()

// btn.addEventListener("click", add)

import supabase from "./config.js";

const title = document.getElementById("title");
const desc = document.getElementById("des");
const priority = document.querySelector(".form-select");
const btn = document.getElementById("btn");
const main = document.getElementById("main");

let editId = null;

/* =====================
   Get current user
===================== */
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/* =====================
   Fetch tasks
===================== */
async function fetchTasks() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("task_manager")
      .select("*")
      .eq("user_id", user.id); // important for RLS

    if (error) throw error;

    main.innerHTML = "";

    data.forEach(task => {
      main.innerHTML += `
        <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
              <div>Status: ${task.status}</div>
            </div>
            <div class="p-2">
              <button class="btn btn-primary btn-sm"
                onclick='edtTodo(${task.id},"${task.title}","${task.description}","${task.status}")'>
                🖊️ Edit
              </button>
              <button class="btn btn-danger btn-sm"
                onclick="deleteTodo(${task.id})">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>`;
    });
  } catch (error) {
    console.log(error);
  }
}

/* =====================
   Add / Update task
===================== */
async function add(e) {
  e.preventDefault();

  if (!title.value || !desc.value || !priority.value) {
    Swal.fire("Warning", "Please fill all fields", "warning");
    return;
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      Swal.fire("Error", "User not logged in", "error");
      return;
    }

    if (editId) {
      // UPDATE
      const { error } = await supabase
        .from("task_manager")
        .update({
          title: title.value,
          description: desc.value,
          status: priority.value
        })
        .eq("id", editId);

      if (error) throw error;

      Swal.fire("Updated!", "Task updated successfully", "success");
      editId = null;
      btn.textContent = "Add Task";
    } else {
      // INSERT (RLS FIX HERE)
      const { error } = await supabase
        .from("task_manager")
        .insert({
          title: title.value,
          description: desc.value,
          status: priority.value,
          user_id: user.id // 🔥 MOST IMPORTANT LINE
        });

      if (error) throw error;

      Swal.fire("Added!", "Task added successfully", "success");
    }

    title.value = "";
    desc.value = "";
    priority.value = "";

    fetchTasks();
  } catch (error) {
    console.log(error);
    Swal.fire("Error", error.message, "error");
  }
}

/* =====================
   Edit
===================== */
window.edtTodo = (id, taskTitle, taskDesc, taskStatus) => {
  editId = id;
  title.value = taskTitle;
  desc.value = taskDesc;
  priority.value = taskStatus;
  btn.textContent = "Update Task";
};

/* =====================
   Delete
===================== */
window.deleteTodo = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  });

  if (!result.isConfirmed) return;

  try {
    const { error } = await supabase
      .from("task_manager")
      .delete()
      .eq("id", id);

    if (error) throw error;

    Swal.fire("Deleted!", "Task deleted successfully", "success");
    fetchTasks();
  } catch (error) {
    console.log(error);
    Swal.fire("Error", error.message, "error");
  }
};

/* =====================
   Init
===================== */
fetchTasks();
btn.addEventListener("click", add);

// logout functionality
// const logoutBtn = document.getElementById('logoutBtn')
//     logoutBtn.addEventListener('click', async () => {
//       const { error } = await supabase.auth.signOut()
//       if (error) {
//         alert('Logout failed: ' + error.message)
//       } else {
//         alert('Successfully logged out!')
//         window.location.href = '/login.html'
//       }
//     })

    const logoutBtn = document.getElementById('logoutBtn')
    logoutBtn.addEventListener('click', async () => {
      // SweetAlert confirmation
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout'
      })

      if (result.isConfirmed) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Logout failed: ' + error.message
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Logged out!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = 'index.html';
          })
        }
      }
    })
  
