
import { supabase } from "./config.js";

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    location.href = "login.html";
  }
}
