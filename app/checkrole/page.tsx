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
  
  // 2. If User is Student (or anyone else), send to Student Dashboard
  // If this component was protecting an Admin route, this redirect implies access denied.
  // We add the query param here so the destination knows to show an alert.
  redirect("/authentication/dashboard?unauthorized=true");

  return null; 
}