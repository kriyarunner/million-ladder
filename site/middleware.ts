import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

function isExcluded(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/opengraph-image") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    PUBLIC_FILE.test(pathname)
  );
}

function prefersDanish(req: NextRequest): boolean {
  const al = (req.headers.get("accept-language") ?? "").toLowerCase();
  const first = al.split(",")[0]?.trim() ?? "";
  return first.startsWith("da");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isExcluded(pathname)) return NextResponse.next();

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const cookie = req.cookies.get("ml_lang")?.value;

  const toEn = (url: URL) => {
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return url;
  };
  const toDa = (url: URL) => {
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return url;
  };

  // Explicit choice (cookie) always wins.
  if (cookie === "en" && !isEn) {
    return NextResponse.redirect(toEn(req.nextUrl.clone()));
  }
  if (cookie === "da" && isEn) {
    return NextResponse.redirect(toDa(req.nextUrl.clone()));
  }

  // First visit, no cookie: auto-detect on the Danish (root) tree only.
  // We never bounce people off an explicit /en URL.
  if (!cookie && !isEn && !prefersDanish(req)) {
    return NextResponse.redirect(toEn(req.nextUrl.clone()));
  }

  // Pass the active language to the root layout for <html lang>.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-ml-lang", isEn ? "en" : "da");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
