"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
export interface NavbarNavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavLink[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

const defaultNavigationLinks: NavbarNavLink[] = [
  { href: "#", label: "Home", active: true },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      signInHref = "/sign-in",
      ctaText = "Sign in",
      ctaHref = "/sign-in",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    // Scroll shadow
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 16);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Responsive
    useEffect(() => {
      const check = () => {
        if (containerRef.current)
          setIsMobile(containerRef.current.offsetWidth < 768);
      };
      check();
      const ro = new ResizeObserver(check);
      if (containerRef.current) ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, []);

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          "fixed top-0 z-50 w-full px-4 md:px-6 transition-all duration-300",
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/30"
            : "bg-transparent",
          className,
        )}
        {...(props as any)}
      >
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between gap-4">
          {/* ── Left ── */}
          <div className="flex items-center gap-6">
            {/* Mobile hamburger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-150">
                    <Menu className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-44 p-1.5 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl"
                >
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0.5">
                      {navigationLinks.map((link, i) => (
                        <NavigationMenuItem className="w-full" key={i}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                              link.active
                                ? "bg-indigo-500/15 text-indigo-300"
                                : "text-slate-400 hover:text-white hover:bg-white/5",
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* Logo */}
            <Link href={logoHref} className="flex items-center gap-2 group">
              <span className="font-extrabold text-base text-white tracking-tight">
                Coursity
              </span>
            </Link>

            {/* Desktop nav links */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList className="gap-0.5">
                  {navigationLinks.map((link, i) => (
                    <NavigationMenuItem key={i}>
                      <Link
                        href={link.href}
                        className={cn(
                          "inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                          link.active
                            ? "text-white bg-white/8"
                            : "text-slate-400 hover:text-white hover:bg-white/5",
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* ── Right ── */}
          <div className="flex items-center gap-2">
            <Link href={ctaHref}>
              <button
                onClick={onCtaClick}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold transition-all duration-150"
              >
                {ctaText}
              
              </button>
            </Link>
          </div>
        </div>
      </header>
    );
  },
);

Navbar.displayName = "Navbar";
