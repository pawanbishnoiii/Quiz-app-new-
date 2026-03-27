import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";
import { useAppStore } from "../store";
import { LogOut, User as UserIcon, Bell, Search } from "lucide-react";

export default function Navbar() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link to="/" className="shrink-0 text-lg font-black uppercase italic tracking-tighter text-orange-500 sm:text-2xl">
            Bnoy
          </Link>
          <div className="relative hidden md:flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search test series..." 
              className="h-9 w-64 max-w-full rounded-full border border-zinc-800 bg-zinc-900 pl-10 pr-4 text-sm transition-colors focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500 border-2 border-zinc-950"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 group-hover:border-orange-500 transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-full w-full p-1.5 text-zinc-500" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium group-hover:text-orange-500 transition-colors">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/auth" className="hidden text-sm font-medium transition-colors hover:text-orange-500 min-[360px]:block">Login</Link>
              <Link 
                to="/auth" 
                className="rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 ease-out hover:bg-orange-600 sm:px-5 sm:py-2 sm:text-sm"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
