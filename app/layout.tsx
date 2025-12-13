import { AuthAlert } from "./checkrole/auth-alert";
import { Suspense } from "react"; // 1. Import Suspense

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
            <AuthAlert />
        </Suspense>
        
        {children}
      </body>
    </html>
  );
}