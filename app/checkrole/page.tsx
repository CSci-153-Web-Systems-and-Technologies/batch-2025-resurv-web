import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";


export default async function CheckRole() {
  const user = await currentUser();

  // 1. Not logged in? Go to login.
  if (!user) {
    redirect("/sign-in"); 
  }

  // 2. Has Admin Role?
  if (user.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  } 
  
  // 3. Has Student Role?
  if (user.publicMetadata?.role === "student") {
    redirect("/student/dashboard");
  }

  // 4. No Role? Render the Healer Component
  return null;
}