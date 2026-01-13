

// import { supabase } from "./config.js";

// const postsDiv = document.getElementById("posts");
// const categoryFilter = document.getElementById("category-filter");
// let currentUser = null;

// async function init() {
//   // 1️⃣ Get current session
//   const { data: { session } } = await supabase.auth.getSession();
//   currentUser = session?.user || null;

//   // 2️⃣ Load posts
//   await loadPosts();

//   // 3️⃣ Category filter change
//   categoryFilter?.addEventListener("change", e => {
//     loadPosts(e.target.value);
//   });
// }

// async function loadPosts(category = "All") {
//   try {
//     let query = supabase.from("posts").select("*").order("created_at", { ascending: false });

//     if (category !== "All") query = query.eq("category", category);

//     const { data: posts, error } = await query;
//     if (error) throw error;

//     renderPosts(posts);
//   } catch (err) {
//     console.error("Load posts error:", err);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: err.message || err,
//       background: "#121212",
//       color: "#fff"
//     });
//   }
// }

// function renderPosts(posts) {
//   postsDiv.innerHTML = "";

//   posts.forEach(post => {
//     const col = document.createElement("div");
//     col.className = "col-sm-6 col-md-4 col-lg-3";

//     const isOwner = currentUser ? post.user_id === currentUser.id : false;

//     const card = document.createElement("div");
//     card.className = "card h-100";

//     card.innerHTML = `
//       ${post.image_url ? `<img src="${post.image_url}" class="card-img-top" alt="Post image">` : ""}
//       <div class="card-body d-flex flex-column">
//         <h5 class="card-title">${post.title}</h5>
//         <p class="card-text">${post.content.substring(0, 120)}${post.content.length > 120 ? '...' : ''}</p>
//         <small class="text-muted mb-2">Category: ${post.category || 'General'} • ${new Date(post.created_at).toLocaleDateString()}</small>
//         ${isOwner ? `
//           <div class="mt-auto d-flex gap-2">
//             <a href="edit.html?id=${post.id}" class="btn btn-sm btn-warning flex-grow-1">Edit</a>
//             <button class="btn btn-sm btn-danger flex-grow-1" onclick="deletePost('${post.id}')">Delete</button>
//           </div>` : ''}
//       </div>
//     `;

//     col.appendChild(card);
//     postsDiv.appendChild(col);
//   });
// }

// // Delete function with SweetAlert
// window.deletePost = async (id) => {
//   const result = await Swal.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!'
//   });

//   if (!result.isConfirmed) return;

//   try {
//     const { error } = await supabase
//       .from("posts")
//       .delete()
//       .eq("id", id)
//       .eq("user_id", currentUser.id);

//     if (error) throw error;

//     await Swal.fire({
//       icon: 'success',
//       title: 'Deleted!',
//       text: 'Your post has been deleted.',
//       background: "#121212",
//       color: "#fff"
//     });

//     loadPosts(categoryFilter.value);
//   } catch (err) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: err.message || err,
//       background: "#121212",
//       color: "#fff"
//     });
//   }
// };

// init();

import { supabase } from "./config.js";

const postsDiv = document.getElementById("posts");
const categoryFilter = document.getElementById("category-filter");
let currentUser = null;

async function init() {
  // 1️⃣ Get current session
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user || null;

  // 2️⃣ Load posts
  await loadPosts();

  // 3️⃣ Category filter change
  categoryFilter?.addEventListener("change", e => {
    loadPosts(e.target.value);
  });
}

async function loadPosts(category = "All") {
  try {
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false });

    if (category !== "All") query = query.eq("category", category);

    const { data: posts, error } = await query;
    if (error) throw error;

    renderPosts(posts);
  } catch (err) {
    console.error("Load posts error:", err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || err,
      background: "#121212",
      color: "#fff"
    });
  }
}

function renderPosts(posts) {
  postsDiv.innerHTML = "";

  posts.forEach(post => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";

    const isOwner = currentUser ? post.user_id === currentUser.id : false;

    const card = document.createElement("div");
    card.className = "card h-100";

    // Short content
    const shortContent = post.content.substring(0, 120);
    const isLong = post.content.length > 120;

    card.innerHTML = `
      ${post.image_url ? `<img src="${post.image_url}" class="card-img-top" alt="Post image">` : ""}
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text" id="post-text-${post.id}">
          ${isLong ? shortContent + "..." : shortContent}
        </p>
        ${isLong ? `<button class="btn btn-link p-0" id="toggle-${post.id}">Learn More</button>` : ""}
        <small class="text-muted mb-2">Category: ${post.category || 'General'} • ${new Date(post.created_at).toLocaleDateString()}</small>
        ${isOwner ? `
          <div class="mt-auto d-flex gap-2">
            <a href="edit.html?id=${post.id}" class="btn btn-sm btn-warning flex-grow-1">Edit</a>
            <button class="btn btn-sm btn-danger flex-grow-1" onclick="deletePost('${post.id}')">Delete</button>
          </div>` : ''}
      </div>
    `;

    col.appendChild(card);
    postsDiv.appendChild(col);

    // Toggle Learn More / Show Less
    if (isLong) {
      const btn = document.getElementById(`toggle-${post.id}`);
      const p = document.getElementById(`post-text-${post.id}`);

      let expanded = false;
      btn.addEventListener("click", () => {
        if (!expanded) {
          p.textContent = post.content;
          btn.textContent = "Show Less";
        } else {
          p.textContent = shortContent + "...";
          btn.textContent = "Learn More";
        }
        expanded = !expanded;
      });
    }
  });
}

// Delete function with SweetAlert
window.deletePost = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (!result.isConfirmed) return;

  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser.id);

    if (error) throw error;

    await Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Your post has been deleted.',
      background: "#121212",
      color: "#fff"
    });

    loadPosts(categoryFilter.value);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || err,
      background: "#121212",
      color: "#fff"
    });
  }
};

init();
