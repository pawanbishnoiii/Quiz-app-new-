import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store";
import { db, doc, updateDoc } from "../firebase";
import { User, Camera, Save, Globe, Shield, LogOut } from "lucide-react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAppStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    language: user?.language || "English",
    examPrep: user?.examPrep || "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), formData);
      setUser({ ...user, ...formData });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Profile Settings</h1>
        <p className="text-zinc-500">Manage your account and preferences.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Avatar & Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <div className="relative mx-auto h-32 w-32">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-zinc-800 bg-zinc-800">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-full w-full p-6 text-zinc-500" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 text-white shadow-lg hover:bg-orange-600 transition-all">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-6 text-xl font-bold text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-8">
              <div>
                <div className="text-lg font-black text-white">{user.xp}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">XP</div>
              </div>
              <div>
                <div className="text-lg font-black text-white">{user.streak}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Streak</div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" /> Logout Session
          </button>
        </div>

        {/* Right: Form */}
        <div className="md:col-span-2 space-y-8">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-xl bg-orange-500/10 p-2 text-orange-500">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Target Exam</label>
                  <select 
                    value={formData.examPrep}
                    onChange={(e) => setFormData({...formData, examPrep: e.target.value})}
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  >
                    {["RPSC", "REET", "SSC", "Railway", "Police", "UPSC", "Other"].map(ex => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Default Language</label>
                <div className="mt-3 flex gap-4">
                  {["English", "Hindi"].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => setFormData({...formData, language: lang as any})}
                      className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-all ${
                        formData.language === lang 
                          ? "border-orange-500 bg-orange-500/5 text-orange-500" 
                          : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-orange-500 px-10 py-4 text-lg font-bold text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
            >
              <Save className="h-5 w-5" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
