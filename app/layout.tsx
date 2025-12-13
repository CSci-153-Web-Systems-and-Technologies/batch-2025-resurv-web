import { ClerkProvider } from '@clerk/nextjs'
import {AuthAlert} from "./checkrole/auth-alert";
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <AuthAlert />
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}