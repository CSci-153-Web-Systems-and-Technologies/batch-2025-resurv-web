import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define specific route groups
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

// Keep your existing protected routes if they are separate
const isProtectedRoute = createRouteMatcher([
  '/authentication/dashboard(.*)',
  '/authentication/eventspaces(.*)',
  '/authentication/calendar(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // 1. Webhooks Check (Keep this first!)
  if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
    return;
  }

  // 2. Ensure user is logged in for protected routes
  if ((isAdminRoute(req) || isStudentRoute(req) || isProtectedRoute(req)) && !userId) {
    return redirectToSignIn();
  }

  // 3. GET USER ROLE
  // This assumes you stored 'role' in publicMetadata in Clerk
  // You might need to check "sessionClaims?.metadata?.role" or just "sessionClaims?.public_metadata?.role"
  // dependent on how you set up your custom claims in Clerk Dashboard.
  const role = sessionClaims?.metadata?.role as string | undefined;

  // 4. PROTECT ADMIN ROUTES
  if (isAdminRoute(req) && role !== 'admin') {
    // If user is NOT admin, kick them out
    console.log(`[Middleware] Blocked ${role} from Admin Route`);
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 5. PROTECT STUDENT ROUTES
  // (Optional: If admins SHOULD access student views, remove "&& role !== 'admin'")
  if (isStudentRoute(req) && role !== 'student' && role !== 'admin') {
    console.log(`[Middleware] Blocked ${role} from Student Route`);
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};