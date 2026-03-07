import {
  ArrowLeftRight,
  BookMarked,
  BookOpen,
  Compass,
  LayoutDashboard,
  Presentation,
  Users,
  Video,
  Wallet,
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Courses", url: "/my-courses", icon: BookOpen },
  { name: "Lectures", url: "/my-lectures", icon: Presentation },
  { name: "Wallet", url: "/wallet", icon: Wallet },
];
export const STUDENT_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Compass },
  { name: "Enrolled Courses", url: "/enrolled-courses", icon: BookMarked },
  { name: "Lectures", url: "/lectures", icon: Video },
  { name: "Transactions", url: "/transactions", icon: ArrowLeftRight },
];

export const ADMIN_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Users", url: "/users", icon: Users },
  { name: "Courses", url: "/courses", icon: BookOpen },
  { name: "Lectures", url: "/lectures", icon: Presentation },
  { name: "User Wallets", url: "/wallets", icon: Wallet },
  { name: "My Wallet", url: "/my-wallet", icon: Wallet },
];
