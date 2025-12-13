# 🚀 Resurv | Batch 2025
### CSci 153: Web Systems and Technologies

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-Database-green) ![Clerk](https://img.shields.io/badge/Clerk-Auth-purple) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

> **Streamlining campus event spaces with secure, role-based reservation management.**

---

## 📖 About The Project

**Resurv** is a modern web application designed to simplify the booking of facility event spaces. Built for the **CSci 153 Batch 2025**, it replaces manual scheduling with a seamless digital interface. 

The system features a strict **Role-Based Access Control (RBAC)** architecture, ensuring a distinct and secure experience for Students and Administrators.

---

## ✨ Key Features

### 🛡️ Secure Authentication & RBAC
* **Dual Portals:** Dedicated dashboards for `Students` and `Admins`.
* **Middleware Protection:** Edge-compatible middleware strictly guards routes.
    * Admins cannot access Student views.
    * Students cannot access Admin views.
    * Unauthorized attempts trigger an auto-redirect with a client-side alert.
* **Clerk Integration:** robust session management and user metadata handling.

### 🎓 Student Portal
* **Easy Booking:** Intuitive form to request facilities (Date, Time, Purpose, Attendees).
* **Real-time Availability:** Integrated calendar view to prevent conflict bookings.
* **Status Tracking:** View the status of requests (Pending, Approved, Rejected).

### ⚡ Admin Dashboard
* **Tabbed Reservation Management:**
    * **Pending Tab:** Review incoming requests with a detailed modal (Requestor Info, Requirements).
    * **Approved Tab:** View active bookings and manage cancellations.
* **Detailed Review Modal:** A "no-guesswork" interface displaying:
    * Full Requestor Profile (Name/Email/ID).
    * Event specifics (Requirements, Attendee count).
    * One-click **Approve** or **Reject** actions.
* **Database Sync:** Row Level Security (RLS) enabled deletion and real-time status updates via Supabase.

---

## 🛠️ Tech Stack

This project leverages the **T3-adjacent stack** for maximum performance and type safety.

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** (App Router) | Core React framework & SSR/ISR |
| **Language** | **TypeScript** | Static typing & reliability |
| **Auth** | **Clerk** | User management & Middleware |
| **Database** | **Supabase** | PostgreSQL database & RLS policies |
| **UI/UX** | **Shadcn UI** + **Tailwind** | Accessible, responsive components |
| **Deploy** | **Vercel** | Edge runtime hosting & CI/CD |

---

## 🚀 Getting Started

Follow these steps to run **Resurv** locally.

### Prerequisites
* Node.js 18+
* npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-resurv-web.git](https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-resurv-web.git)
    cd batch-2025-resurv-web
    ```

2.  **Install dependencies**
    *Note: We strictly use the latest compatible versions to support Edge Runtime.*
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root and add your keys:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    
    NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```bash
├── app/
│   ├── (auth)/             # Login/Signup routes
│   ├── admin/              # Admin dashboard & logic
│   ├── student/            # Student reservation interface
│   ├── layout.tsx          # Root layout with AuthAlert & Suspense
│   └── page.tsx            # Role-checker entry point
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── auth-alert.tsx      # Client-side security popup
├── middleware.ts           # Edge-compatible route guard
└── public/                 # Static assets