import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth"; // Firebase Admin SDK for token verification

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Assuming the token is stored in cookies

  if (!token) {
    // If no token is found, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    console.log("Decoded Token:", decodedToken);

    // Token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error);

    // Invalid token, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Specify routes to apply the middleware
export const config = {
  matcher: ["/add", "/edit", "/delete", "/logout"], // Protect these routes
};