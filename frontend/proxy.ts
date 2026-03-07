import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "./constants/routes";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  userId: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  exp: number;
  username: string;
  isVerified: boolean;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  console.log("token received : ", token);

  if (pathname.startsWith("/lecture")) {
    if (!token) return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }

  if (!token && !PUBLIC_ROUTES.includes(pathname))
    return NextResponse.redirect(new URL("/sign-in", request.url));

  if (token) {
    const decoded = jwtDecode<JWTPayload>(token);
    console.log("decoded token : ", decoded);
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(
        new URL(`/${decoded.role.toLocaleLowerCase()}`, request.url),
      );
    }

    if (!pathname.startsWith(`/${decoded.role.toLocaleLowerCase()}`)) {
      console.log("redirecing to rolewise", decoded.role.toLocaleLowerCase());
      return NextResponse.redirect(
        new URL(`/${decoded.role.toLocaleLowerCase()}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
