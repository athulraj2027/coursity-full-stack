import {
  ArrowLeftRight,
  BadgePercent,
  Book,
  BookMarked,
  BookOpen,
  Compass,
  LayoutDashboard,
  MessageSquareMore,
  Presentation,
  TicketPercent,
  User2,
  Users,
  Video,
  Wallet,
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Courses", url: "/my-courses", icon: BookOpen },
  { name: "Lectures", url: "/my-lectures", icon: Presentation },
  { name: "Wallet", url: "/wallet", icon: Wallet },
  { name: "Profile", url: "/profile", icon: User2 },
  { name: "Offers", url: "/offers", icon: BadgePercent },
  { name: "Coupons", url: "/coupons", icon: TicketPercent },
  { name: "Feedbacks", url: "/feedbacks", icon: MessageSquareMore },
];
export const STUDENT_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Compass },
  { name: "Enrolled Courses", url: "/enrolled-courses", icon: BookMarked },
  { name: "Lectures", url: "/lectures", icon: Video },
  { name: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { name: "Homeworks", url: "/homeworks", icon: Book },
];

export const ADMIN_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Users", url: "/users", icon: Users },
  { name: "Courses", url: "/courses", icon: BookOpen },
  { name: "Lectures", url: "/lectures", icon: Presentation },
  { name: "User Wallets", url: "/wallets", icon: Wallet },
  { name: "My Wallet", url: "/my-wallet", icon: Wallet },
];

export const COMMON_LINKS = [
  { name: "Settings", url: "/settings", icon: User2 },
];
