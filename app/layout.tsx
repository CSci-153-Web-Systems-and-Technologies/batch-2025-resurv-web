import { AuthAlert } from "./checkrole/auth-alert";
import { Suspense } from "react"; // 1. Import Suspense
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Suspense fallback={null}>
            <AuthAlert />
        </Suspense>
        
        {children}
      </body>
    </html>
  </ClerkProvider>
  );
}