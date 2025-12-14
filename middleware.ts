import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define Public Routes (Allow these without login)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/login(.*)', 
  '/signup(.*)',   // <--- matches /signup
  '/sign-up(.*)',  // <--- matches /sign-up (Clerk default)
  '/check-role',
  '/api/webhooks(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // A. Public Route? Let them pass.
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // B. Protect everything else
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (!userId) {
    // If they try to go to a protected page without logging in, send them to login
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // C. Role Checks
  const role = (sessionClaims as any)?.metadata?.role;

  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isStudentRoute(req) && role !== 'student') {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};