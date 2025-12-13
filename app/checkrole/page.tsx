import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function CheckRole() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  // 1. If User is Admin, send them to Admin Dashboard
  if (user.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  } 
  
// 2. Student Redirect
  if (user.publicMetadata?.role === "student") {
    redirect("/student/dashboard");
  }



  return null; 
}