import NextAuth from "next-auth";
//nextjs sepecific, not nextAuth or auth.js

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {  // does not using this auth becox of the edge cases of prisma therefore using authConfig 
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;  // return true or false
  console.log("ROUTH", req.nextUrl.pathname)
  console.log("isLoggedIN", isLoggedIn)

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);  // next auth need this to work properly, no need to protect this, do not accedentelly protect it
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);  // always open for any users , not required authentication
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);  // this routes need authentication, so if login redirect to setting , if not then login page

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))  // becox it creates absolute nextURL=http://localhost:3000/settings
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}