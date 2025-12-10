import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function CheckRole() {
  // 1. Get the currently logged-in user
  const user = await currentUser();

  // 2. If no user (error case), send back to login
  if (!user) {
    redirect("/login");
  }

  // 3. Check the role from Metadata
  if (user.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  } 
  
  // 4. Default: Redirect to Student Dashboard
  // (Make sure this path matches your actual folder structure!)
  redirect("/authentication/dashboard");

  // 5. This line is crucial to fix the "Not a React Component" error
  return null; 
}