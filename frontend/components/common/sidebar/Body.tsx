"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/queries/auth.queries";
import {
  ADMIN_LINKS,
  STUDENT_LINKS,
  TEACHER_LINKS,
} from "@/constants/dashboard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";

const Body = () => {
  const { data, isLoading } = useMe();

  const pathname = usePathname();

  if (isLoading || !data) return null;
  const user = data.user;

  const userRole = user.role;
  let links: { name: string; url: string; icon: any }[] = [];

  if (userRole === "STUDENT") links = STUDENT_LINKS;
  else if (userRole === "TEACHER") links = TEACHER_LINKS;
  else if (userRole === "ADMIN") links = ADMIN_LINKS;

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {links.map((link) => {
            const fullPath = `/${userRole.toLowerCase()}${link.url}`;
            const isActive = pathname === fullPath;

            return (
              <SidebarMenuItem key={link.name}>
                <SidebarMenuButton asChild>
                  <Link
                    href={fullPath}
                    className={`
            group relative flex items-center gap-3 rounded-xl px-3 py-2.5
            transition-all duration-200
            ${
              isActive
                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            }
          `}
                  >
                    {/* Active left accent bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/50" />
                    )}

                    {/* Icon */}
                    <link.icon
                      className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-neutral-400 group-hover:text-neutral-600"
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />

                    {/* Label */}
                    <span
                      className={`text-sm transition-all duration-200 ${
                        isActive ? "font-semibold text-white" : "font-medium"
                      }`}
                    >
                      {link.name}
                    </span>

                    {/* Active dot indicator */}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {!user.isVerified && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={`/${user.role.toLowerCase()}/verify-otp`}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  {/* Icon with ping */}
                  <div className="relative shrink-0">
                    <ShieldAlert
                      className="h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors duration-200"
                      strokeWidth={1.8}
                    />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500">
                      <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                    </span>
                  </div>

                  {/* Label */}
                  <span className="text-sm font-medium">Verify Account</span>

                  {/* Arrow */}
                  <ArrowRight className="w-3.5 h-3.5 text-red-300 ml-auto shrink-0 group-hover:translate-x-0.5 group-hover:text-red-400 transition-all duration-200" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default Body;
