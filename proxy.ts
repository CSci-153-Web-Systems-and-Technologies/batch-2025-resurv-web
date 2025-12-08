import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
const isProtectedRoute = createRouteMatcher([
  '/authentication/dashboard(.*)',
  '/authentication/eventspaces(.*)',
  '/authentication/calendar(.*)',
]);
export default clerkMiddleware(async (auth, req) => {
  // 2. CRITICAL FIX: Allow Webhooks to bypass protection completely
  if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
    return; // Don't protect this route, let it pass!
  }

  // 3. Protect everything else defined above
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};