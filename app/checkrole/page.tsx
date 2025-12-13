import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import RoleSync from "@/components/rolesync";

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



  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Setting up your account...</h2>
        <p>Please wait while we assign your role.</p>
        <RoleSync /> 
      </div>
    </div>
  );
}