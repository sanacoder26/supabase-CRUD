
import { supabase } from "./config.js";
import { requireAuth } from "./authGuard.js";

document.addEventListener("DOMContentLoaded", async () => {
  await requireAuth();

  // baqi edit post ka code
});


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const form = document.getElementById("edit-form");
    if (!form) return;

    const postId = new URLSearchParams(window.location.search).get("id");
    if (!postId) {
      location.href = "index.html";
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      location.href = "login.html";
      return;
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error || post.user_id !== session.user.id) {
      Swal.fire({
        icon: "error",
        title: "Access denied",
        background: "#121212",
        color: "#fff"
      });
      location.href = "index.html";
      return;
    }

    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      const imageFile = document.getElementById("image").files[0];

      let imageUrl = post.image_url;

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, "")}`;
        await supabase.storage.from("post-images").upload(fileName, imageFile);
        imageUrl = supabase.storage.from("post-images").getPublicUrl(fileName).data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("posts")
        .update({ title, content, image_url: imageUrl })
        .eq("id", postId)
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      Swal.fire({
        icon: "success",
        title: "Post Updated",
        background: "#121212",
        color: "#fff"
      });

      setTimeout(() => location.href = "index.html", 1200);
    });

  } catch (err) {
    Swal.fire("Error", err.message || err, "error");
  }
});
