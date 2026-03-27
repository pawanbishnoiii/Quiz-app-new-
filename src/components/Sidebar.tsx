import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Trophy, 
  Settings, 
  ShieldCheck,
  Bookmark,
  HelpCircle
} from "lucide-react";
import { useAppStore } from "../store";

export default function Sidebar() {
  const { user } = useAppStore();

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/test-series", icon: BookOpen, label: "My Test Series" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  ];

  const adminLinks = [
    { to: "/admin", icon: ShieldCheck, label: "Admin Panel" },
  ];

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 border-r border-zinc-800 bg-zinc-950 md:block">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Main Menu</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-orange-500/10 text-orange-500" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <div className="mt-8 pt-8 border-t border-zinc-900">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Management</p>
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-orange-500/10 text-orange-500" 
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`
                  }
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1 pt-4 border-t border-zinc-900">
          <NavLink
            to="/help"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </NavLink>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
