

// import { supabase } from "./config.js";
// import { requireAuth } from "./authGuard.js";

// document.addEventListener("DOMContentLoaded", async () => {
//   // 1️⃣ Make sure user is logged in
//   await requireAuth();

//   // 2️⃣ Get the form
//   const form = document.getElementById("create-form");
//   if (!form) return;

//   // 3️⃣ Handle form submit
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     try {
//       // 4️⃣ Get input values
//       const title = document.getElementById("title").value.trim();
//       const content = document.getElementById("content").value.trim();
//       const category = document.getElementById("category").value;
//       const imageFile = document.getElementById("image").files[0];

//       if (!title || !content) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Title & Content are required!",
//           background: "#121212",
//           color: "#fff"
//         });
//         return;
//       }

//       // 5️⃣ Get logged-in user
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw "Login required";

//       let imageUrl = null;

//       // 6️⃣ Upload image if exists
//       if (imageFile) {
//         const cleanName = imageFile.name.replace(/\s+/g, "-");
//         const fileName = `${Date.now()}-${cleanName}`;

//         const { error: uploadError } = await supabase
//           .storage
//           .from("post-images") // Bucket name (must match your Supabase)
//           .upload(fileName, imageFile, { upsert: true });

//         if (uploadError) throw uploadError;

//         const { data: publicData } = supabase
//           .storage
//           .from("post-images")
//           .getPublicUrl(fileName);

//         imageUrl = publicData.publicUrl;
//       }

//       // 7️⃣ Insert into Supabase
//       const { data, error } = await supabase
//         .from("posts") // Table name (must match)
//         .insert([
//           {
//             user_id: session.user.id,
//             title,
//             content,
//             category,
//             image_url: imageUrl
//           }
//         ])
//         .select(); // select to get inserted row

//       if (error) throw error;

//       // 8️⃣ Show success alert
//       Swal.fire({
//         icon: "success",
//         title: "Post Created",
//         text: "Your blog has been published",
//         background: "#121212",
//         color: "#fff",
//         confirmButtonColor: "#ffc107"
//       });

//       // 9️⃣ Reset form
//       form.reset();

//       // 10️⃣ Redirect after short delay
//       setTimeout(() => {
//         window.location.href = "index.html";
//       }, 1200);

//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.message || err,
//         background: "#121212",
//         color: "#fff"
//       });
//       console.error("Create post error:", err);
//     }
//   });
// });

import { supabase } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Get current session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    Swal.fire("Error", "Login required", "error");
    location.href = "login.html";
    return;
  }

  const currentUser = session.user;

  const form = document.getElementById("create-form");
  if (!form) return;

  // 2️⃣ Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      const category = document.getElementById("category").value;
      const imageFile = document.getElementById("image").files[0];

      if (!title || !content) {
        return Swal.fire("Error", "Title & content are required", "error");
      }

      let imageUrl = null;

      // 3️⃣ Upload image if exists
      if (imageFile) {
        const cleanName = imageFile.name.replace(/\s+/g, "-");
        const fileName = `${Date.now()}-${cleanName}`;

        const { error: uploadError } = await supabase
          .storage
          .from("post-images")   // Bucket name
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // 4️⃣ Insert post into Supabase
      const { error } = await supabase.from("posts").insert({
        user_id: currentUser.id,
        title,
        content,
        category,
        image_url: imageUrl
      });

      if (error) throw error;

      // 5️⃣ SweetAlert success + redirect
      await Swal.fire({
        icon: "success",
        title: "Post Created",
        text: "Redirecting to blog feed...",
        background: "#121212",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      location.href = "index.html";

    } catch (err) {
      console.error("Create post error:", err);
      Swal.fire("Error", err.message || err, "error");
    }
  });
});
