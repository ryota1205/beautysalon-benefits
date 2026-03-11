import { auth } from "@/lib/auth";

const ROLE_PATHS: Record<string, string> = {
  COMPANY_ADMIN: "/company",
  EMPLOYEE: "/employee",
  BEAUTICIAN: "/beautician",
  PLATFORM_ADMIN: "/admin",
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardRoute =
    pathname.startsWith("/company") ||
    pathname.startsWith("/employee") ||
    pathname.startsWith("/beautician") ||
    pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  // Allow API routes
  if (isApiRoute) return;

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn && userRole) {
    return Response.redirect(new URL(ROLE_PATHS[userRole] || "/", nextUrl));
  }

  // Protect dashboard routes
  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Ensure users only access their own portal
  if (isDashboardRoute && isLoggedIn && userRole) {
    const allowedPath = ROLE_PATHS[userRole];
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      return Response.redirect(new URL(allowedPath, nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
