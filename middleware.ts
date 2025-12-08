import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/authentication/dashboard(.*)',
  '/authentication/eventspaces(.*)',
  '/authentication/calendar(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Log what is happening to your terminal
  console.log(`[Middleware] Checking: ${req.nextUrl.pathname}`);
  console.log(`[Middleware] User Logged In? ${!!userId}`);

  // 2. Allow Webhooks (CRITICAL)
  if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
    return; // Let it pass!
  }

  // 3. Protect routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};