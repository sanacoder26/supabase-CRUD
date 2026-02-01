import { supabase } from "./config.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

// ---------- SIGNUP ----------
window.signup = async function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });

  if (error) {
    Swal.fire("Error", error.message, "error");
  } else {
    Swal.fire("Success", "Account created successfully", "success");
    setTimeout(() => window.location.href = "login.html", 1200);
  }
};

// ---------- LOGIN ----------
window.login = async function () {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    Swal.fire("Login Failed", error.message, "error");
  } else {
    Swal.fire("Success", "Login successful", "success");
    setTimeout(() => window.location.href = "todo.html", 1200);
  }
};

