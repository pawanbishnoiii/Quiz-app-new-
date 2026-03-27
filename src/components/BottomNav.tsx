import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Search, 
  BookOpen, 
  Trophy, 
  User 
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-orange-500" : "text-zinc-500"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </NavLink>
        <NavLink
          to="/test-series"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-orange-500" : "text-zinc-500"
            }`
          }
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Tests</span>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-orange-500" : "text-zinc-500"
            }`
          }
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 -mt-6">
            <Search className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Search</span>
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-orange-500" : "text-zinc-500"
            }`
          }
        >
          <Trophy className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Rank</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-orange-500" : "text-zinc-500"
            }`
          }
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
