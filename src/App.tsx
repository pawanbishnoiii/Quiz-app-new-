import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db, onSnapshot, collection, doc, getDoc, setDoc } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAppStore } from "./store";
import { User } from "./types";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import TestSeriesDetails from "./pages/TestSeriesDetails";
import TestPlayer from "./pages/TestPlayer";
import ResultPage from "./pages/Result";
import Profile from "./pages/Profile";
import SearchPage from "./pages/Search";
import Leaderboard from "./pages/Leaderboard";
import NotificationsPage from "./pages/Notifications";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";

export default function App() {
  const { user, setUser, setLoading, loading } = useAppStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          const isAdmin = firebaseUser.email === "bnoy.studios@gmail.com" || firebaseUser.email === "pk8345357@gmail.com";
          if (isAdmin && userData.role !== "admin") {
            userData.role = "admin";
            await setDoc(doc(db, "users", firebaseUser.uid), { role: "admin" }, { merge: true });
          }
          setUser(userData);
        } else {
          // New user will be handled in Auth onboarding
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (!isAuthReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-pulse text-2xl font-bold tracking-tighter uppercase italic">Bnoy</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <div className="flex">
          {user && <Sidebar />}
          <main className={`flex-1 ${user ? 'md:ml-64' : ''} p-4 md:p-8`}>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/admin/*" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
              <Route path="/test-series/:id" element={<TestSeriesDetails />} />
              <Route path="/test/:id" element={<TestPlayer />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/auth" />} />
            </Routes>
          </main>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}
